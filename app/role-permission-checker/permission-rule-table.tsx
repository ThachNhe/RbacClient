import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActionBadgeVariant } from "@/lib/utils";
import { PermissionRule } from "@/types";

interface PermissionRuleTableProps {
  rules: PermissionRule[];
  type: "lack" | "redundant";
}

export function PermissionRuleTable({ rules, type }: PermissionRuleTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Condition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No {type === "lack" ? "missing" : "redundant"} rules found
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule, index) => (
              <TableRow
                key={`${rule.role}-${rule.action}-${rule.resource}-${index}`}
              >
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {rule.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(rule.action)}>
                    {rule.action.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{rule.resource}</TableCell>
                <TableCell>
                  <code className="text-xs font-mono p-1 bg-muted rounded break-all">
                    {rule.condition || "No condition"}
                  </code>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
