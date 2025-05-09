class UIManager {
    constructor(game) {
        this.game = game;
        this.previousMoveCount = 0;
        this.setupEventListeners();
        this.setupStuckDetection();
    }

    setupEventListeners() {
        document.getElementById('reset-btn').addEventListener('click', () => this.game.reset());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('log-btn').addEventListener('click', () => this.game.getLogManager().showLog());
        document.getElementById('solve-btn').addEventListener('click', () => this.game.getSolver().solve());
        
        // Add functionality to the Next Game button
        const nextGameButton = document.querySelector('.next-game-button');
        if (nextGameButton) {
            nextGameButton.addEventListener('click', () => {
                alert('Next game feature coming soon!');
            });
        }
    }

    setupStuckDetection() {
        setInterval(() => {
            this.previousMoveCount = this.game.getMoveCount();
        }, 5000);
    }

    updateStats() {
        document.getElementById('moves').textContent = `Moves: ${this.game.getMoveCount()}`;
        document.getElementById('min-moves').textContent = `Minimum Moves: ${Math.pow(2, this.game.getTotalDisks()) - 1}`;
        
        // Check for win condition
        if (this.game.getTowers()[2].getDisks().length === this.game.getTotalDisks()) {
            document.getElementById('message').textContent = 'Congratulations. You won!';
        } else {
            document.getElementById('message').textContent = '';
        }
    }

    showHint() {
        // Calculate optimal solution steps
        const optimalMoves = Math.pow(2, this.game.getTotalDisks()) - 1;
        const progress = Math.min(100, Math.round((this.game.getMoveCount() / optimalMoves) * 100));
        
        // Analyze game state
        const state = this.analyzeGameState();
        
        // Generate context-aware hints
        let hint = "";
        
        if (this.game.getMoveCount() === 0) {
            hint = "Start by moving the smallest disk. For an odd number of disks, move it to the destination tower; for even, move to the auxiliary tower.";
        } else if (state.isStuck) {
            hint = "You seem stuck. Remember the pattern: move the smallest disk in a clockwise direction (A to B, B to C, or C to A), then make the only valid move that doesn't involve the smallest disk.";
        } else if (state.suboptimalMoves > 5) {
            hint = "Your solution is taking longer than needed. Try to develop a consistent pattern when moving the disks.";
        } else if (state.nearCompletion) {
            hint = "You're almost there! Focus on moving the remaining smaller disks in the right sequence to build on top of the larger ones.";
        } else {
            // Choose a hint based on the specific game situation
            const situationalHints = [
                "Look for the smallest disk - it should move in a consistent cycle between towers.",
                "After moving the smallest disk, there's always exactly one other valid move. Can you spot it?",
                "Think about which tower needs to be cleared to receive the next largest disk.",
                "The Tower of Hanoi has a recursive pattern. How you moved 2 disks is how you'll move groups of disks.",
                "Sometimes you need to make moves that temporarily seem to take you further from your goal."
            ];
            
            // Choose a hint based on disk count, move count, and tower state
            const hintIndex = (this.game.getMoveCount() + this.game.getTotalDisks() + 
                               this.game.getTowers()[1].getDisks().length) % situationalHints.length;
            hint = situationalHints[hintIndex];
        }
        
        document.getElementById("hint").innerHTML = hint;
    }

    analyzeGameState() {
        const towers = this.game.getTowers();
        return {
            isStuck: this.game.getMoveCount() > 0 && this.previousMoveCount === this.game.getMoveCount(),
            suboptimalMoves: this.game.getMoveCount() - this.calculateMinimumMoves(),
            nearCompletion: towers[2].getDisks().length >= this.game.getTotalDisks() - 2
        };
    }

    calculateMinimumMoves() {
        const tower2Disks = this.game.getTowers()[2].getDisks().length;
        return Math.pow(2, this.game.getTotalDisks()) - 1 - tower2Disks * 2;
    }
}