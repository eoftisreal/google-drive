import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { GoogleDriveProvider } from './google-drive.provider';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService, GoogleDriveProvider],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Google Drive provider', () => {
    const provider = service.getProvider('GOOGLE_DRIVE');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('GOOGLE_DRIVE');
  });

  it('should throw error for unknown provider', () => {
    expect(() => service.getProvider('UNKNOWN')).toThrow('Storage provider UNKNOWN not found');
  });
});
