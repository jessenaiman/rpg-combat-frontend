// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Future: Load sprite images here
}

function create() {
    // Initialize scene properties
    this.characters = {}; // Store character containers
    this.report = null;   // Store the latest combat report

    // Create UI Controls
    const simulateButton = this.add.text(100, 10, 'Simulate', { fontSize: '16px', fill: '#fff' })
        .setInteractive()
        .on('pointerdown', () => simulateCombat(this));
    this.viewLogButton = this.add.text(config.width - 100, 10, 'View Log', { fontSize: '16px', fill: '#fff' })
        .setInteractive()
        .on('pointerdown', () => showLogModal(this))
        .setVisible(false); // Hidden until a report is available

    // Loading Indicator
    this.loadingText = this.add.text(config.width / 2, config.height / 2, 'Simulating...', { fontSize: '24px', fill: '#fff' })
        .setOrigin(0.5)
        .setVisible(false);

    // Summary Stats Display
    this.statsText = this.add.text(10, config.height - 100, 'No simulation run yet.', { fontSize: '16px', fill: '#fff' });

    // Error Message Display
    this.errorText = this.add.text(config.width / 2, config.height / 2 + 50, '', { fontSize: '16px', fill: '#ff0000' })
        .setOrigin(0.5)
        .setVisible(false);

    // Log Modal (hidden by default)
    this.logModal = this.add.container(0, 0).setVisible(false);
    const modalBg = this.add.rectangle(config.width / 2, config.height / 2, 400, 300, 0x000000, 0.8);
    const logText = this.add.text(config.width / 2, config.height / 2 - 100, '', { fontSize: '14px', fill: '#fff', wordWrap: { width: 380 } })
        .setOrigin(0.5, 0);
    const closeButton = this.add.text(config.width / 2, config.height / 2 + 100, 'Close', { fontSize: '16px', fill: '#fff' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.logModal.setVisible(false));
    this.logModal.add([modalBg, logText, closeButton]);
}

// Helper Functions

function createHealthBar(scene, x, y, width, height, maxHealth, currentHealth) {
    const bar = scene.add.graphics();
    bar.fillStyle(0xff0000, 1); // Red background (max health)
    bar.fillRect(x, y, width, height);
    const healthWidth = Math.max(0, (currentHealth / maxHealth) * width); // Ensure no negative width
    bar.fillStyle(0x00ff00, 1); // Green foreground (current health)
    bar.fillRect(x, y, healthWidth, height);
    return bar;
}

function updateCharacters(scene, report) {
    // Clear existing characters
    Object.values(scene.characters).forEach(container => container.destroy());
    scene.characters = {};

    const characterNames = Object.keys(report.characters);
    const spacing = config.width / (characterNames.length + 1);

    characterNames.forEach((name, index) => {
        const x = (index + 1) * spacing;
        const y = config.height / 2;
        const container = scene.add.container(x, y);

        // Placeholder sprite (blue rectangle)
        const sprite = scene.add.rectangle(0, 0, 50, 100, 0x0000ff);
        sprite.setOrigin(0.5);

        // Health bar (assuming max health of 1000 for now)
        const maxHealth = 1000; // Hardcoded; adjust when API provides max health
        const currentHealth = report.characters[name].health;
        const healthBar = createHealthBar(scene, -25, -60, 50, 10, maxHealth, currentHealth);

        // Character name label
        const nameText = scene.add.text(0, 50, name, { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);

        container.add([sprite, healthBar, nameText]);
        scene.characters[name] = container;
    });
}

function updateStats(scene, report) {
    const statsLines = [];
    for (const name in report.damage_dealt) {
        const damage = report.damage_dealt[name] || 0;
        const healing = report.healing_done[name] || 0;
        const spells = report.spells_cast[name] || 0;
        statsLines.push(`${name}: Damage: ${damage}, Healing: ${healing}, Spells: ${spells}`);
    }
    scene.statsText.setText(statsLines.join('\n'));
}

async function simulateCombat(scene) {
    scene.loadingText.setVisible(true);
    scene.errorText.setVisible(false);

    try {
        const turns = document.getElementById('turns-input').value || 10;
        const simulateResponse = await fetch(`http://localhost:8000/combat/simulate?turns=${turns}`, { method: 'POST' });
        if (!simulateResponse.ok) throw new Error('Simulation failed');

        const reportResponse = await fetch('http://localhost:8000/combat/report');
        if (!reportResponse.ok) throw new Error('Failed to fetch report');

        scene.report = await reportResponse.json();

        // Update UI
        updateCharacters(scene, scene.report);
        updateStats(scene, scene.report);
        scene.viewLogButton.setVisible(true);
    } catch (error) {
        console.error('Error:', error);
        scene.errorText.setText(`Error: ${error.message}`).setVisible(true);
    } finally {
        scene.loadingText.setVisible(false);
    }
}

function showLogModal(scene) {
    if (!scene.report) return;
    const logLines = scene.report.timeline.map(entry => 
        `Turn ${entry.turn}: ${entry.character} ${entry.action} - Healths: ${JSON.stringify(entry.healths)}`
    );
    scene.logModal.getAt(1).setText(logLines.join('\n')); // Update log text (second child)
    scene.logModal.setVisible(true);
}