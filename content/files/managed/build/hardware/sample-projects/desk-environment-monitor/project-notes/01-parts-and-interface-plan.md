# Parts and interface plan

> Example planning notes. Choose actual components and verify their documentation before assembly.

## Keep the first version small

The first prototype only needs a sensor, a controller, and a display. Logging, networking, and a battery can wait until the basic reading loop works.

## Data flow

~~~text
sensor -> measurement -> validation -> display
                              |
                              +-> last-good reading
~~~

## Display states

| State | Display |
| --- | --- |
| Starting | Waiting for the first reading |
| Ready | Temperature, humidity, and update time |
| Sensor unavailable | A clear message; keep the last-good reading marked stale |

## Open questions

- Is a high-contrast display readable from the normal sitting position?
- Where should ventilation openings go in the enclosure?
- How long should a reading remain valid after a sensor error?
