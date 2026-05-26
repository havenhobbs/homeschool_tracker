function ProgressBar ({ value, max, color }) {
    const percentage = max === 0 ? 0 : Math.round((value / max) * 100);
    return (
        <div style = {{ background: '#eee', borderRadius: '4px', width: '100%', height: '20px', overflow: 'hidden' }}>
            <div style = {{ background: color, width: `${percentage}%`, height: '100%' }}></div>
        </div>
    );
}

export default ProgressBar;


