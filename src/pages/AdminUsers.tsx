import { getRegisteredMemberCount, getRegisteredMembersForAdmin } from "@/data/memberStats";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminUsers = () => {
  const total = getRegisteredMemberCount();
  const rows = getRegisteredMembersForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-muted-foreground font-['Space_Grotesk']">Total players</p>
        <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight font-['Space_Grotesk'] sm:text-5xl">
          {total}
        </p>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
          Demo app: this count comes from the ranking dataset. Connect your backend later to show real sign-ups.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-6 py-4 sm:px-8">
          <h2 className="text-base font-semibold font-['Space_Grotesk']">Player directory</h2>
          <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mt-0.5">
            Name, rank, and points as shown in the app leaderboard.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="font-['Space_Grotesk'] hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right tabular-nums">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-['Space_Grotesk']">
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tabular-nums text-muted-foreground">{row.rank}</TableCell>
                <TableCell className="font-medium">
                  {row.name}
                  {row.isCurrentUser ? (
                    <span className="ml-2 text-xs font-normal text-primary">(demo “you”)</span>
                  ) : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.points.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
