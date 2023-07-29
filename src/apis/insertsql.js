import httpInstance from "@/utils/http"

export function insertSQLAPI(sqlCode) {
  return httpInstance.post("/insert", { sql: sqlCode })
}


