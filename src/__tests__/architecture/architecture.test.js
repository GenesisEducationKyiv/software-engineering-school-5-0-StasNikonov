const madge = require('madge');
const path = require('path');

const SRC_PATH = path.join(__dirname, '../../api');

describe('Architecture Dependency Rules', () => {
  let graph;

  beforeAll(async () => {
    graph = await madge(SRC_PATH);
  });

  test('Presentation should not depend on Infrastructure', async () => {
    const deps = await graph.obj();

    const presentationFiles = Object.keys(deps).filter((f) =>
      f.startsWith('presentation/'),
    );

    const errors = [];

    for (const file of presentationFiles) {
      const imported = deps[file];
      for (const imp of imported) {
        if (imp.startsWith('infrastructure/')) {
          errors.push(`${file} -> ${imp}`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  test('Application should not depend on Presentation and Infrastructure', async () => {
    const deps = await graph.obj();

    const presentationFiles = Object.keys(deps).filter((f) =>
      f.startsWith('application/'),
    );

    const errors = [];

    for (const file of presentationFiles) {
      const imported = deps[file];
      for (const imp of imported) {
        if (imp.startsWith('infrastructure/')) {
          errors.push(`${file} -> ${imp}`);
        }
        if (imp.startsWith('presentation/')) {
          errors.push(`${file} -> ${imp}`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  test('Domain must not depend on Application, Infrastructure or Presentation', async () => {
    const deps = await graph.obj();

    const presentationFiles = Object.keys(deps).filter((f) =>
      f.startsWith('domain/'),
    );

    const errors = [];

    for (const file of presentationFiles) {
      const imported = deps[file];
      for (const imp of imported) {
        if (imp.startsWith('infrastructure/')) {
          errors.push(`${file} -> ${imp}`);
        }
        if (imp.startsWith('presentation/')) {
          errors.push(`${file} -> ${imp}`);
        }
        if (imp.startsWith('application/')) {
          errors.push(`${file} -> ${imp}`);
        }
      }
    }

    expect(errors).toEqual([]);
  });
});
