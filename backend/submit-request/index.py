"""Приём заявок с лендинга и получение списка заявок для админки."""
import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")

    # POST — принять заявку
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        comment = body.get("comment", "").strip()

        if not name or not phone:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "name and phone required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO requests (name, phone, comment) VALUES (%s, %s, %s) RETURNING id",
            (name, phone, comment),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "id": row[0]})}

    # GET — список заявок (для админки)
    if method == "GET":
        token = (event.get("headers") or {}).get("x-admin-token", "")
        if token != os.environ.get("ADMIN_TOKEN", ""):
            return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "unauthorized"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, name, phone, comment, status, admin_reply, created_at FROM requests ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        requests_list = [
            {"id": r[0], "name": r[1], "phone": r[2], "comment": r[3], "status": r[4], "admin_reply": r[5], "created_at": str(r[6])}
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"requests": requests_list})}

    # PUT — обновить статус/ответ (для админки)
    if method == "PUT":
        token = (event.get("headers") or {}).get("x-admin-token", "")
        if token != os.environ.get("ADMIN_TOKEN", ""):
            return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "unauthorized"})}

        body = json.loads(event.get("body") or "{}")
        req_id = body.get("id")
        status = body.get("status")
        admin_reply = body.get("admin_reply")

        if not req_id:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "id required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE requests SET status=%s, admin_reply=%s, updated_at=NOW() WHERE id=%s",
            (status, admin_reply, req_id),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "method not allowed"})}
