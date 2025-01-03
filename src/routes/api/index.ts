// Define the structure of the versions object
type VersionsType = {
    [version: string]: {
        [object: string]: {
            [action: string]: (
                model: any,
                request: any,
                method: string,
                cb: (err: boolean, result: any) => void
            ) => void;
        };
    };
};
import versions from './versions';
import express from 'express';
import model from '../../models';

const router = express.Router();

// Ensure the versions object conforms to the defined type
const typedVersions: VersionsType = versions;

// Route handler for dynamic version/object/action
router.use('/:version/:object/:action', (req, res) => {
    const params = req.params;
    const post = req.body;
    const query = req.query;
    //Attach files to the post object if they exist
    post.files = (req as any).files || null

    const Object = params.object;
    const Action = params.action;
    const Version = params.version;
    const method = req.method;

    let request: any = method === 'POST' || method === 'PUT' ? post : query;

    //check if the function exists in versions
    if(
        typedVersions[Version] &&
        typedVersions[Version][Object] &&
        typeof typedVersions[Version][Object][Action] === 'function'
    ) {
        typedVersions[Version][Object][Action](
            model, request, method, (err: any, data: any) => {
                if(err) {
                    res.status(400).send(data);
                } else {
                    res.status(200).send(data);
                }
            }
        );
    } else {
        res.send({ success: false, code: '005' });
    }
});

export default router;