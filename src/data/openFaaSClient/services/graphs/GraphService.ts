// - Import react components
import { Graph } from 'core/domain/graphs';
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
  public addGraph = (graph: Graph, collection: string) => {
    return " Not implemented!" as any

    }

  /**
   * Update graph
   */
  public updateGraph = (graph: Graph, collection: string) => {
    return " Not implemented!" as any
  }

    /**
     * Get graphs data
     */
  public getGraphs = (collection: string, leftNode?: string | null, edgeType?: string, rightNode?: string | null) => {
    return " Not implemented!" as any

    }

  /**
   * Delete graph by node identifier
   */
  public deleteGraphByNodeId = (nodeId: string) => {
    return " Not implemented!" as any

  }

  /**
   * Delete graph
   */
  public deleteGraph = (collection: string, leftNode?: string | null, edgeType?: string, rightNode?: string | null)  => {
    return " Not implemented!" as any

    }

  /**
   * Get graphs query
   */
  private getGraphsQuery = (collection: string, leftNode?: string | null, edgeType?: string, rightNode?: string | null) => {
    return " Not implemented!" as any
  }

}
