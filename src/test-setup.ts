import { beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {

    vi.spyOn(console, 'error')
        .mockImplementation(() => { });

    vi.spyOn(console, 'warn')
        .mockImplementation(() => { });

});

afterEach(() => {
    vi.restoreAllMocks();
});