import bufferNode from './bufferNode';

const recordings = {};

export function createRecorder(id, ctx) {
  const buf = bufferNode(ctx);
  buf.connect(ctx.destination);      
  return {
    record: (note) => {
      note.connect(buf);
    },
    disconnect: (note) => {
      note.disconnect(buf);
    },
    stop:() => {
    }
  };
}

function save(blob) {
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'foo.ogg';
    a.click();
}



