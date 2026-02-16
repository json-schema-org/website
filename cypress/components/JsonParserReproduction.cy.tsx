
import getPartsOfJson from '../../lib/getPartsOfJson';

describe('JsonParserReproduction', () => {
    it('should correctly parse JSON with escaped backslash at the end of a string', () => {
        const problemJson = `{ "bad_string": "backslash: \\\\", "next_key": "this should be found" }`;

        const parts = getPartsOfJson(problemJson);

        // Check if 'next_key' is identified as an object property
        const nextKeyPart = parts.find(p => p.match === 'next_key' && p.type === 'objectProperty');

        // Log parts for debugging if it fails
        if (!nextKeyPart) {
            console.log('Parsed parts:', JSON.stringify(parts, null, 2));
        }

        expect(nextKeyPart).to.not.be.undefined;
    });
});
