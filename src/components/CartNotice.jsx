export default function CartNotice({ messages, onDismiss }) {
  if (messages.length === 0) return null;

  return (
    <div className="notice" role="status">
      <h2>Your cart was updated</h2>
      <ul>
        {messages.map((message) => <li key={message}>{message}</li>)}
      </ul>
      <button type="button" className="btn btn-secondary" onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
