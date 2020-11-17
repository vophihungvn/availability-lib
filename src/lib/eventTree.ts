import { AvailabilityEvent } from "./avaiability.types";

class Node {
  constructor(
    public event: AvailabilityEvent,
    public left?: Node,
    public right?: Node
  ) {}

  public toJSON = () => {
    const obj: { [key: string]: any } = {
      date: this.event.date,
      left: null,
      right: null,
    };

    if (this.left) {
      obj.left = this.left.toJSON();
    }

    if (this.right) {
      obj.right = this.right.toJSON();
    }

    return obj;
  };
}

class EventTree {
  private head: Node | undefined;
  constructor(events: AvailabilityEvent[]) {
    this.head = this.setupTree(events);
  }

  private setupTree = (events: AvailabilityEvent[] = []): Node | undefined => {
    if (events.length === 0) return undefined;
    if (events.length === 1) {
      return new Node(events[0]);
    }

    const mid = Math.floor(events.length / 2);
    const midEvent = events[mid];
    const node = new Node(
      midEvent,
      this.setupTree(events.slice(0, mid)),
      this.setupTree(events.slice(mid + 1))
    );

    return node;
  };

  public getHead = (): Node | undefined => this.head;

  public dumpTree = (): any => this.head?.toJSON();

  public getNode = (
    date: String,
    currentNode = this.head
  ): Node | undefined => {
    if (currentNode?.event.date === date) return currentNode;
    if (!currentNode?.left && !currentNode?.right) return undefined;

    if (date > currentNode.event.date) {
      if (currentNode.right) {
        return this.getNode(date, currentNode.right);
      } else {
        return undefined;
      }
    } else {
      if (currentNode.left) {
        return this.getNode(date, currentNode.left);
      } else {
        return undefined;
      }
    }
  };
}

export { EventTree };
