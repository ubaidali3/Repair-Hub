import React from "react";
import { api } from "../lib/api.js";
import Data from "./Data.jsx";
import Empty from "./Empty.jsx";
import Gate from "./Gate.jsx";

export default function Notifications({ user }) {
  async function mark(id) {
    await api.patch(`/notifications/${id}/read`);
    window.location.reload();
  }
  return (
    <main className="content">
      <h1>Notifications</h1>
      {!user ? (
        <Gate />
      ) : (
        <Data url="/notifications">
          {(items) =>
            items.length ? (
              <div className="stack">
                {items.map((n) => (
                  <article className="panel" key={n._id}>
                    <p>{n.text}</p>
                    <small>{new Date(n.createdAt).toLocaleString()}</small>
                    {!n.read && (
                      <button className="secondary" onClick={() => mark(n._id)}>
                        Mark read
                      </button>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty text="No notifications" />
            )
          }
        </Data>
      )}
    </main>
  );
}
