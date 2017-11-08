import { TestBed, inject } from '@angular/core/testing';

import { CustomerAccount } from './customer-account.service';

describe('CustomerAccount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerAccount]
    });
  });

  it('should be created', inject([CustomerAccount], (service: CustomerAccount) => {
    expect(service).toBeTruthy();
  }));
});
