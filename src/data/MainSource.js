import semver from 'semver';
import DocsSource from './DocsSource';

const branchBlacklist = new Set(['docs', 'webpack', 'v8']);
export default new DocsSource({
  id: 'main',
  name: 'Main library',
  global: 'Discord',
  repo: 'discord.js',
  defaultTag: 'v12',
  branchFilter: branch => !branchBlacklist.has(branch) && !branch.startsWith('dependabot/'),
  tagFilter: tag => tag.startsWith("@") || semver.gte(tag, '9.0.0'),
});
