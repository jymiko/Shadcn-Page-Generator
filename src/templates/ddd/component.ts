import type { GeneratorConfig } from '../../types/index.js';

/**
 * Generates Presentation Layer Component with full CRUD features
 * This is the most complex template with all UI logic
 */
export function generateComponent(config: GeneratorConfig): string {
  const {
    entityName,
    moduleName,
    pageName,
    routePath,
    columns,
    filters,
    includeStats,
    includeRowSelection,
    dataFetching,
    sortableColumns,
    animations
  } = config;

  const isTanStack = dataFetching === 'tanstack';
  const hasAnimations = animations.listAnimations || animations.cardAnimations;

  // Generate imports based on features
  const imports = `'use client';

${hasAnimations ? `import { motion, type Variants } from 'framer-motion';` : ''}
import { useEffect, useState } from 'react';
import { ${entityName} } from '../../domain/entities/${moduleName}.entity';
import { Get${entityName}sUseCase } from '../../application/use-cases/get-${moduleName}s.use-case';
import { ${entityName}Repository } from '../../infrastructure/repositories/${moduleName}.repository';
${isTanStack ? `import { useQuery } from '@tanstack/react-query';` : ''}
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
${filters.some(f => f.type === 'date') ? `import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';` : ''}
import { Badge } from '@/components/ui/badge';
${includeStats ? `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';` : ''}
import {
  Search,
  Plus,
  X,
  RefreshCcw,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ${sortableColumns.length > 0 ? 'ArrowUpDown, ArrowUp, ArrowDown,' : ''}
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
${includeRowSelection ? `import { Checkbox } from "@/components/ui/checkbox";` : ''}`;

  // Generate animation variants and components if needed
  const animationVariants = hasAnimations ? `
// Framer Motion animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${animations.intensity === 'bold' ? '0.1' : animations.intensity === 'subtle' ? '0.03' : '0.05'}
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ${animations.intensity === 'bold' ? '0.3' : animations.intensity === 'subtle' ? '0.15' : '0.2'} }
  }
};
${animations.listAnimations ? `
// Create motion-wrapped TableRow component
const MotionTableRow = motion(TableRow);
` : ''}
` : '';

  // Generate data fetching code
  const dataFetchingCode = isTanStack ? `
  // TanStack Query data fetching
  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ['${moduleName}', searchParams.toString()],
    queryFn: async () => {
      const repo = new ${entityName}Repository();
      const useCase = new Get${entityName}sUseCase(repo);
      return await useCase.execute({
        q: searchParams.get('q'),
        page: searchParams.get('page'),
        limit: pageSize,
        sortBy: searchParams.get('sortBy'),
        order: searchParams.get('order'),
        ...Object.fromEntries(searchParams.entries())
      });
    }
  });` : `
  const [data, setData] = useState<${entityName}[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const repo = new ${entityName}Repository();
      const useCase = new Get${entityName}sUseCase(repo);
      const result = await useCase.execute({
        q: searchParams.get('q'),
        page: searchParams.get('page'),
        limit: pageSize,
        sortBy: searchParams.get('sortBy'),
        order: searchParams.get('order'),
        ...Object.fromEntries(searchParams.entries())
      });
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);`;

  // Generate row selection code
  const rowSelectionCode = includeRowSelection ? `
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === (data?.length || 0)) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data?.map(i => i.id) || []));
    }
  };` : '';

  // Generate stats cards
  const statsCards = includeStats ? `
      {/* Stats Cards */}
      ${animations.cardAnimations ? `<motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >` : `<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">`}
        ${animations.cardAnimations ? `<motion.div variants={itemVariants}>` : ''}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total ${entityName}s</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        ${animations.cardAnimations ? `</motion.div>` : ''}

        ${animations.cardAnimations ? `<motion.div variants={itemVariants}>` : ''}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+4 since yesterday</p>
            </CardContent>
          </Card>
        ${animations.cardAnimations ? `</motion.div>` : ''}

        ${animations.cardAnimations ? `<motion.div variants={itemVariants}>` : ''}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">-2 since yesterday</p>
            </CardContent>
          </Card>
        ${animations.cardAnimations ? `</motion.div>` : ''}

        ${animations.cardAnimations ? `<motion.div variants={itemVariants}>` : ''}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+1 since yesterday</p>
            </CardContent>
          </Card>
        ${animations.cardAnimations ? `</motion.div>` : ''}
      ${animations.cardAnimations ? `</motion.div>` : `</div>`}
` : '';

  // Generate filter components
  const filterComponents = filters.map(f => {
    if (f.type === 'select') {
      return `
            <Select
              value={searchParams.get('${f.key}') || 'all'}
              onValueChange={(value) => updateParam('${f.key}', value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="${f.label}" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ${f.label}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>`;
    } else if (f.type === 'date') {
      return `
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !searchParams.get('${f.key}') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchParams.get('${f.key}') ? (
                    format(new Date(searchParams.get('${f.key}')!), "PPP")
                  ) : (
                    <span>${f.label}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchParams.get('${f.key}') ? new Date(searchParams.get('${f.key}')!) : undefined}
                  onSelect={(date) => updateParam('${f.key}', date ? date.toISOString() : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>`;
    }
    return '';
  }).join('\n');

  // Generate table column headers
  const tableHeaders = columns.map(c => {
    const isSortable = sortableColumns.includes(c.key);
    if (isSortable) {
      return `                <TableHead className="cursor-pointer" onClick={() => handleSort('${c.key}')}>
                  <div className="flex items-center gap-1">
                    ${c.label.toUpperCase()}
                    {searchParams.get('sortBy') === '${c.key}' ? (
                      searchParams.get('order') === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </TableHead>`;
    }
    return `                <TableHead>${c.label.toUpperCase()}</TableHead>`;
  }).join('\n');

  // Generate table cells
  const tableCells = columns.map(c => {
    if (c.key === 'status') {
      return `                            <TableCell>
                              <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="rounded-full">
                                {item.status}
                              </Badge>
                            </TableCell>`;
    }
    if (c.type === 'date') {
      return `                            <TableCell className="text-muted-foreground">{new Date(item.${c.key}).toLocaleDateString()}</TableCell>`;
    }
    return `                            <TableCell>{item.${c.key}}</TableCell>`;
  }).join('\n');

  const colSpan = columns.length + 2 + (includeRowSelection ? 1 : 0);

  return `${imports}

/**
 * ${entityName} List Component
 * Generated by shadcn-page-gen
 *
 * Features:
 * - Search and filters
 * - Sorting: ${sortableColumns.length > 0 ? sortableColumns.join(', ') : 'None'}
 * - Pagination
 * - Row actions (View, Edit, Delete)
 * ${includeStats ? '- Stats cards' : ''}
 * ${includeRowSelection ? '- Row selection' : ''}
 * ${animations.listAnimations || animations.cardAnimations ? `- Framer Motion animations (${animations.intensity})` : ''}
 */
${animationVariants}
export function ${entityName}List() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const pageSize = Number(searchParams.get('limit')) || 10;
${dataFetchingCode}
${rowSelectionCode}

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    if (key !== 'page') params.set('page', '1');

    router.push('?' + params.toString());
  };

  ${sortableColumns.length > 0 ? `const handleSort = (key: string) => {
    const currentSort = searchParams.get('sortBy');
    const currentOrder = searchParams.get('order');

    let newOrder = 'asc';
    if (currentSort === key && currentOrder === 'asc') {
      newOrder = 'desc';
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', key);
    params.set('order', newOrder);
    router.push('?' + params.toString());
  };` : ''}

  return (
    <div className="space-y-6">
${statsCards}
      {/* Actions Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => updateParam('q', searchTerm)}
              className="pl-9 w-full md:max-w-md"
            />
          </div>
${filterComponents}
          {(searchParams.toString().length > 0) && (
            <Button variant="ghost" size="icon" onClick={() => router.push('/${routePath}')} title="Reset Filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => ${isTanStack ? 'refetch()' : 'fetchData()'}}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> New ${entityName}
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                ${includeRowSelection ? `<TableHead className="w-[50px]"><Checkbox checked={data?.length > 0 && selectedRows.size === data?.length} onCheckedChange={toggleAll} /></TableHead>` : ''}
                <TableHead className="w-[100px]">ID</TableHead>
${tableHeaders}
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={${colSpan}} className="text-center h-24 text-muted-foreground">Loading data...</TableCell>
                </TableRow>
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={${colSpan}} className="text-center h-24 text-muted-foreground">No results found.</TableCell>
                </TableRow>
              ) : (
                ${animations.listAnimations ? `
                data.map((item, index) => (
                  <MotionTableRow
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="group"
                  >` : `data.map((item) => (
                  <TableRow key={item.id} className="group">`}
                    ${includeRowSelection ? `<TableCell><Checkbox checked={selectedRows.has(item.id)} onCheckedChange={() => toggleRow(item.id)} /></TableCell>` : ''}
                    <TableCell className="font-medium">{item.id}</TableCell>
${tableCells}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Record</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  ${animations.listAnimations ? `</MotionTableRow>` : `</TableRow>`}
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={pageSize.toString()} onValueChange={(v) => updateParam('limit', v)}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
        <Pagination className="justify-end w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
`;
}
