import React from "react";
import { Link } from "react-router-dom";

export default function Gate() {
  return (
    <p className="notice">
      You need a customer or technician account with the appropriate
      permissions. <Link to="/login">Sign in</Link>
    </p>
  );
}
