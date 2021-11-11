export default class Command {
    constructor(name, options) {
        this.name = name || null;
        this.aliases = options.aliases || null;
        this.description = options.description || 'No description';
    }
}