export const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      color: 'black',
      fontSize: '20px',
      textAlign: 'center'
    }}>
      <h1>🎉 React is Working!</h1>
      <p>If you can see this, the app is rendering correctly.</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
};
