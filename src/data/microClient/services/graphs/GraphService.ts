import { injectable } from 'inversify';

import { IGraphService } from './IGraphService';

/**
 * Firbase graph service
 *
 * @export
 * @class GraphService
 * @implements {IGraphService}
 */
@injectable()
export class GraphService implements IGraphService {
    /**
     * Add graph
     */
    public addGraph = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Update graph
     */
    public updateGraph = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Get graphs data
     */
    public getGraphs = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Delete graph by node identifier
     */
    public deleteGraphByNodeId = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Delete graph
     */
    public deleteGraph = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Get graphs query
     */
    private getGraphsQuery = () => {
        return ' Not implemented!' as any;
    };
}
