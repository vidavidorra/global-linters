import { Linters } from '.';

describe('Linters', (): void => {
  const linters = Object.keys(Linters);

  test.each(linters)('%s has `versionOption`', (linter): void => {
    expect(Linters[linter].versionOption !== undefined);
  });

  test.each(linters)(
    '%s has `jsonFormat?.option` and `jsonFormat?.sinceVersion`',
    (linter): void => {
      if (Linters[linter].jsonFormat !== undefined) {
        expect(Linters[linter].jsonFormat.option !== undefined);
        expect(Linters[linter].jsonFormat.sinceVersion !== undefined);
      }
    }
  );
});
