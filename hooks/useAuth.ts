import { useState, useEffect } from "react";
// REMOVE all supabase imports and logic
// Clerk will be integrated here later
export const useAuth = () => {
  return { user: null, loading: false };
};
