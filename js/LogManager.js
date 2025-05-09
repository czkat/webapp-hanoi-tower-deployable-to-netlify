class LogManager {
    constructor() {
        this.moveLog = [];
        this.setupCloseEvents();
    }

    logMove(diskValue, from, to) {
        const fromPeg = String.fromCharCode(65 + from); // A, B, or C
        const toPeg = String.fromCharCode(65 + to); // A, B, or C
        this.moveLog.push(`Disk ${diskValue} from ${fromPeg} to ${toPeg}`);
        
        // Send log to server
        this.sendLogToServer(this.moveLog.length);
    }

    sendLogToServer(moveCount) {
        fetch('/.netlify/functions/logMove', {
            method: 'POST',
            body: JSON.stringify({ moves: moveCount }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(error => console.error('Error logging move:', error));
    }

    showLog() {
        const modal = document.getElementById('log-modal');
        const logContent = document.getElementById('log-content');
        
        if (this.moveLog.length === 0) {
            logContent.innerHTML = '<p>No moves recorded yet.</p>';
        } else {
            logContent.innerHTML = this.moveLog.map((log, index) => 
                `<p>${index + 1}. ${log}</p>`
            ).join('');
        }
        
        modal.style.display = 'block';
    }

    setupCloseEvents() {
        // Close the modal when clicking the X
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('log-modal').style.display = 'none';
        });
        
        // Close the modal when clicking outside of it
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('log-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    clear() {
        this.moveLog = [];
    }
}