// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const game = new Game();
    
    // Make game globally accessible for debugging
    window.towerGame = game;
});