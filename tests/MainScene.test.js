import MainScene from '../src/scenes/MainScene';

// Mock Phaser
jest.mock('phaser', () => ({
  Scene: class {
    constructor(key) {
      this.key = key;
    }
  }
}));

describe('MainScene', () => {
  it('should initialize correctly', () => {
    const scene = new MainScene();
    expect(scene.key).toBe('MainScene');
  });
});