export const Linters = {
  hadolint: {
    versionOption: '--version',
    jsonFormat: {
      option: '--format=json',
      sinceVersion: '>=1.5.0',
    },
  },
  shellcheck: {
    versionOption: '--version',
    jsonFormat: {
      option: '--format=json',
      sinceVersion: '>=0.4.0',
    },
  },
};
