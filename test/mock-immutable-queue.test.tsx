import { createMockImmutableQueue } from '../src';

interface Notification {
  message: string;
}

describe('createMockImmutableQueue', () => {
  it('should add and remove a notification', () => {
    const queue = createMockImmutableQueue<Notification>();

    expect(queue.entries).toEqual([]);

    queue.add('test', { message: 'test' });

    expect(queue.entries.length).toEqual(1);
    expect(queue.entries[0]).toEqual({
      id: 'test',
      data: { message: 'test' },
    });

    queue.remove('test');

    expect(queue.entries).toEqual([]);

    queue.add('test', { message: 'test' });
    queue.add('test2', { message: 'test' });

    expect(queue.entries.length).toEqual(2);

    queue.add('test', { message: 'test2' });

    // It should just update the existing notification
    expect(queue.entries.length).toEqual(2);

    queue.removeAll();

    expect(queue.entries.length).toEqual(0);
  });

  it('should call the onRemove callback when removing a notification', () => {
    const onRemoveCalls: string[] = [];

    const reset = () => {
      onRemoveCalls.splice(0, onRemoveCalls.length);
    };

    const onRemove = (id: string) => () => {
      onRemoveCalls.push(id);
    };

    const q1 = createMockImmutableQueue<Notification>();

    const q2 = q1.add('test', { message: 'test' }, onRemove('test'));

    expect(onRemoveCalls).toEqual([]);

    q2.remove('test');

    expect(onRemoveCalls).toEqual(['test']);

    reset();

    const q3 = createMockImmutableQueue<Notification>();

    // Add multiple
    const q4 = q3
      .add('test', { message: 'test' }, onRemove('test'))
      .add('test2', { message: 'test' }, onRemove('test2'));

    expect(onRemoveCalls).toEqual([]);

    q4.removeAll();

    expect(onRemoveCalls).toEqual(['test', 'test2']);
  });
});
