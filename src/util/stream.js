export const processStreamInBatch = async ({
                                               stream,
                                               batchSize = 500,
                                               transformItem,
                                               processBatch,
                                               onError = async ({err}) => {
                                                   console.log(err)
                                               }
                                           }) => {
    let batch = [];
    let i = 0;
    for await (const data of stream) {
        batch.push(await transformItem(data))

        if (batch.length !== batchSize) {
            continue;
        }

        try {
            await processBatch(batch);
            i += batchSize;
        } catch (err) {
            await onError({err, batch})
        }

        console.log(`finished processing ${i} items`)
        batch = []
    }

    if (batch.length === 0) {
        return
    }

    try {
        await processBatch(batch);
        i += batch.length;
        console.log(`finished processing ${i} items`)
    } catch (err) {
        await onError({err, batch})
    }
}
