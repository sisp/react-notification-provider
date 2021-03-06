import { renderHook, cleanup, act } from '@testing-library/react-hooks';
import { useQueue, createImmutableQueue } from '../src';

interface Notification {
  message: string;
}

describe('useQueue', () => {
  afterEach(cleanup);

  it('should add and remove a queued item', () => {
    const { result } = renderHook(() =>
      useQueue<Notification>(createImmutableQueue())
    );
    expect(result.current.entries).toEqual([]);

    act(() => {
      result.current.add('test', { message: 'test' });
    });

    expect(result.current.entries.length).toEqual(1);
    expect(result.current.entries[0]).toEqual({
      id: 'test',
      data: { message: 'test' },
    });

    act(() => {
      result.current.remove('test');
    });

    expect(result.current.entries).toEqual([]);

    act(() => {
      result.current.add('test', { message: 'test' });
      result.current.add('test2', { message: 'test' });
    });

    expect(result.current.entries.length).toEqual(2);

    act(() => {
      result.current.add('test', { message: 'test2' });
    });

    // It should just update the existing notification
    expect(result.current.entries.length).toEqual(2);

    act(() => {
      result.current.removeAll();
    });

    expect(result.current.entries.length).toEqual(0);
  });
});
