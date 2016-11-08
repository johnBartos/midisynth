export default function bufferNode(ctx) {
    const node = ctx.createScriptProcessor(4096, 1, 1);
    const tempBuffer = [];
    node.onaudioprocess = (e) => {
        const input = e.inputBuffer;
        const output = e.outputBuffer;
        for (let channel = 0; channel < output.numberOfChannels; channel += 1) {
            var inputData = input.getChannelData(channel);
            var outputData = output.getChannelData(channel);
            for (var sample = 0; sample < input.length; sample++) {
                output[sample] = inputData[sample];
            }
        }
    };

    return node;
}