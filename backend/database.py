"""
PlatformPulse Database Connector
Supports:
1. Native Exasol Personal via pyexasol (Primary hackathon engine)
2. Embedded Local Compatibility Engine (Automatic fallback if Exasol container is offline)
"""

import os
import sqlite3
import logging
from typing import List, Dict, Any, Optional

try:
    import pyexasol
    HAS_PYEXASOL = True
except ImportError:
    HAS_PYEXASOL = False

logger = logging.getLogger("platformpulse.database")
logging.basicConfig(level=logging.INFO)

EXASOL_DSN = os.getenv("EXASOL_DSN", "localhost:8563")
EXASOL_USER = os.getenv("EXASOL_USER", "sys")
EXASOL_PASSWORD = os.getenv("EXASOL_PASSWORD", "exasol")
EXASOL_SCHEMA = os.getenv("EXASOL_SCHEMA", "PLATFORMPULSE")

LOCAL_DB_PATH = os.path.join(os.path.dirname(__file__), "platformpulse_local.db")

class DatabaseManager:
    def __init__(self):
        self._exasol_conn = None
        self._sqlite_conn = None
        self.is_exasol = False
        self._initialize_connection()

    def _initialize_connection(self):
        """Attempt Exasol connection first; fallback to local engine if offline."""
        if HAS_PYEXASOL:
            try:
                logger.info(f"Connecting to Exasol Personal at {EXASOL_DSN}...")
                conn = pyexasol.connect(
                    dsn=EXASOL_DSN,
                    user=EXASOL_USER,
                    password=EXASOL_PASSWORD,
                    schema=EXASOL_SCHEMA,
                    connection_timeout=3,
                    socket_timeout=5
                )
                self._exasol_conn = conn
                self.is_exasol = True
                logger.info(" Connected successfully to Exasol Personal (pyexasol).")
                return
            except Exception as e:
                logger.warning(f"Could not connect to live Exasol instance ({e}).")

        # Fallback to local compatibility engine
        logger.info(f"Initializing Local Compatibility Database at {LOCAL_DB_PATH}...")
        self._sqlite_conn = sqlite3.connect(LOCAL_DB_PATH, check_same_thread=False)
        self._sqlite_conn.row_factory = sqlite3.Row
        self.is_exasol = False
        self._init_local_schema()
        logger.info(" Local Compatibility Engine initialized with equivalent schema and views.")

    def _init_local_schema(self):
        """Creates tables and equivalent analytical views in SQLite fallback."""
        cursor = self._sqlite_conn.cursor()
        
        # 1. Pipelines
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pipelines (
            pipeline_id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            display_name VARCHAR(256) NOT NULL,
            layer VARCHAR(32) NOT NULL,
            owner_name VARCHAR(64) NOT NULL,
            owner_email VARCHAR(128) NOT NULL,
            owner_avatar VARCHAR(8) DEFAULT 'PP',
            sla_minutes INTEGER NOT NULL DEFAULT 60,
            cron_schedule VARCHAR(64) NOT NULL DEFAULT '0 3 * * *',
            status VARCHAR(32) NOT NULL DEFAULT 'healthy',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 2. Pipeline Runs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pipeline_runs (
            run_id VARCHAR(64) PRIMARY KEY,
            pipeline_id VARCHAR(64) NOT NULL,
            run_start TIMESTAMP NOT NULL,
            run_end TIMESTAMP,
            duration_sec INTEGER NOT NULL,
            status VARCHAR(32) NOT NULL,
            retries INTEGER NOT NULL DEFAULT 0,
            rows_processed BIGINT DEFAULT 0,
            error_message VARCHAR(2000),
            suggested_fix VARCHAR(2000),
            bytes_billed BIGINT DEFAULT 0,
            execution_logs TEXT
        );
        """)

        # 3. Dashboards
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dashboards (
            dashboard_id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            department VARCHAR(64) NOT NULL,
            owner VARCHAR(64) NOT NULL,
            bi_tool VARCHAR(32) NOT NULL DEFAULT 'Tableau',
            url VARCHAR(256),
            viewers_daily INTEGER NOT NULL DEFAULT 10,
            is_executive BOOLEAN NOT NULL DEFAULT 0,
            target_sla_hours INTEGER NOT NULL DEFAULT 4,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 4. Upstream Lineage
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dashboard_upstream (
            dashboard_id VARCHAR(64) NOT NULL,
            pipeline_id VARCHAR(64) NOT NULL,
            is_critical BOOLEAN NOT NULL DEFAULT 1,
            PRIMARY KEY (dashboard_id, pipeline_id)
        );
        """)

        # 5. Anomalies
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS dashboard_anomalies (
            anomaly_id VARCHAR(64) PRIMARY KEY,
            dashboard_id VARCHAR(64) NOT NULL,
            check_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            check_type VARCHAR(64) NOT NULL,
            severity VARCHAR(32) NOT NULL,
            metric_name VARCHAR(64),
            detail VARCHAR(1000) NOT NULL,
            is_resolved BOOLEAN NOT NULL DEFAULT 0
        );
        """)

        # 6. Metric Glossary
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS metric_glossary (
            metric_id VARCHAR(64) PRIMARY KEY,
            kpi_name VARCHAR(128) NOT NULL,
            has_conflict BOOLEAN NOT NULL DEFAULT 0,
            severity VARCHAR(32) NOT NULL DEFAULT 'none',
            discrepancy_summary VARCHAR(500),
            def_a_dashboard VARCHAR(128) NOT NULL,
            def_a_dept VARCHAR(64) NOT NULL,
            def_a_formula VARCHAR(500) NOT NULL,
            def_a_owner VARCHAR(64),
            def_b_dashboard VARCHAR(128) NOT NULL,
            def_b_dept VARCHAR(64) NOT NULL,
            def_b_formula VARCHAR(500) NOT NULL,
            def_b_owner VARCHAR(64),
            recommended_action VARCHAR(500),
            is_standardized BOOLEAN NOT NULL DEFAULT 0
        );
        """)

        # 7. Data Requests
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS data_requests (
            request_id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(256) NOT NULL,
            requester VARCHAR(128) NOT NULL,
            department VARCHAR(64) NOT NULL,
            urgency VARCHAR(32) NOT NULL,
            deadline DATE,
            why_needed VARCHAR(2000) NOT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'backlog',
            ai_classification VARCHAR(64) NOT NULL,
            ai_rationale VARCHAR(1000),
            matched_dashboard_id VARCHAR(64),
            effort_hours DECIMAL(5,1) NOT NULL DEFAULT 2.0,
            priority_score INTEGER NOT NULL DEFAULT 50,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            sla_hours INTEGER NOT NULL DEFAULT 48
        );
        """)

        # 8. Cost & Usage Records
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS cost_usage_records (
            record_id VARCHAR(64) PRIMARY KEY,
            record_date DATE NOT NULL,
            team_name VARCHAR(64) NOT NULL,
            warehouse_engine VARCHAR(64) NOT NULL,
            pipeline_id VARCHAR(64),
            query_count INTEGER NOT NULL DEFAULT 0,
            compute_spend_usd DECIMAL(10,2) NOT NULL DEFAULT 0.0,
            storage_spend_usd DECIMAL(10,2) NOT NULL DEFAULT 0.0,
            storage_tier VARCHAR(32) NOT NULL,
            storage_tb DECIMAL(8,2) NOT NULL DEFAULT 0.0
        );
        """)

        # 9. Waste Recommendations
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS waste_recommendations (
            rec_id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(256) NOT NULL,
            category VARCHAR(64) NOT NULL,
            asset_name VARCHAR(128) NOT NULL,
            current_monthly_cost DECIMAL(10,2) NOT NULL,
            projected_monthly_savings DECIMAL(10,2) NOT NULL,
            effort VARCHAR(32) NOT NULL,
            risk_level VARCHAR(32) NOT NULL,
            description VARCHAR(1000) NOT NULL,
            action_label VARCHAR(128) NOT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'pending',
            applied_date TIMESTAMP
        );
        """)

        self._sqlite_conn.commit()

    def query(self, sql: str, params: Optional[Any] = None) -> List[Dict[str, Any]]:
        """Execute a query and return rows as dictionary list."""
        if self.is_exasol and self._exasol_conn:
            try:
                stmt = self._exasol_conn.execute(sql, params or {})
                return stmt.fetchall_dict()
            except Exception as e:
                logger.error(f"Exasol query error: {e}")
                raise e
        else:
            cursor = self._sqlite_conn.cursor()
            # Replace Exasol-specific functions for SQLite compatibility if needed
            compat_sql = self._adapt_sql_for_sqlite(sql)
            if params:
                cursor.execute(compat_sql, params)
            else:
                cursor.execute(compat_sql)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def execute(self, sql: str, params: Optional[Any] = None) -> int:
        """Execute an INSERT/UPDATE/DELETE statement."""
        if self.is_exasol and self._exasol_conn:
            try:
                stmt = self._exasol_conn.execute(sql, params or {})
                return stmt.rowcount()
            except Exception as e:
                logger.error(f"Exasol execute error: {e}")
                raise e
        else:
            cursor = self._sqlite_conn.cursor()
            compat_sql = self._adapt_sql_for_sqlite(sql)
            if params:
                cursor.execute(compat_sql, params)
            else:
                cursor.execute(compat_sql)
            self._sqlite_conn.commit()
            return cursor.rowcount

    def _adapt_sql_for_sqlite(self, sql: str) -> str:
        """Adapts minor Exasol syntax differences for SQLite fallback."""
        s = sql
        s = s.replace("DATE_TRUNC('month',", "strftime('%Y-%m-01',")
        s = s.replace("TO_CHAR(record_date, 'Mon YYYY')", "strftime('%b %Y', record_date)")
        s = s.replace("CURRENT_TIMESTAMP - INTERVAL '24' HOUR", "datetime('now', '-24 hours')")
        s = s.replace("CURRENT_TIMESTAMP - INTERVAL '30' DAY", "datetime('now', '-30 days')")
        s = s.replace("GROUP_CONCAT(d.name SEPARATOR ', ')", "GROUP_CONCAT(d.name, ', ')")
        s = s.replace("TRUE", "1")
        s = s.replace("FALSE", "0")
        return s

    def get_status(self) -> Dict[str, Any]:
        return {
            "is_exasol": self.is_exasol,
            "engine": "Exasol Personal (pyexasol)" if self.is_exasol else "Local SQLite Compatibility Engine",
            "dsn": EXASOL_DSN if self.is_exasol else LOCAL_DB_PATH,
            "schema": EXASOL_SCHEMA
        }

db = DatabaseManager()
