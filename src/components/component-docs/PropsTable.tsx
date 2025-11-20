import React from 'react';
import { PropDefinition } from '@/types/page';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PropsTableProps {
    props: PropDefinition[];
}

export function PropsTable({ props }: PropsTableProps) {
    if (!props || props.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No props defined for this component.
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[200px]">Type</TableHead>
                        <TableHead className="w-[150px]">Default</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.map((prop, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-mono font-semibold">
                                {prop.name}
                                {prop.required && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                        Required
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                                {prop.type}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {prop.defaultValue || '—'}
                            </TableCell>
                            <TableCell className="text-sm">{prop.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
