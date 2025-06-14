// Service functions for notifications
const API_BASE = 'http://localhost:5000/api/notifications';

export async function getNotifications(token) {
  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationRead(id, token) {
  const res = await fetch(`${API_BASE}/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function generateReminders(token) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to generate reminders');
  return res.json();
}
