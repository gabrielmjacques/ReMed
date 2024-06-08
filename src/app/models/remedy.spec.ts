import { Remedy } from './remedy';

describe('Remedy', () => {
  it('should create an instance', () => {
    expect(new Remedy('Paracetamol', 'Comprimido', 2, 8, new Date('2023-01-01T08:14:32'))).toBeTruthy();
  });
});
