import { Button } from "../components/ui/button.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card.tsx";

export function HoverCardDemo() {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover Here</Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">@nextjs</div>
        <div>The React Framework – created and maintained by @vercel.</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Joined December 2021
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Important Data Structure Reminder
// power_lines.geojson
// FeatureCollection
//  └ Feature
//      └ properties
//         ├ name
//         ├ voltage
//         ├ operator
//      └ geometry
//         └ LineString
// ndvi_points.geojson
// FeatureCollection
//  └ Feature
//      └ properties
//         └ ndvi
//      └ geometry
//         └ Point
