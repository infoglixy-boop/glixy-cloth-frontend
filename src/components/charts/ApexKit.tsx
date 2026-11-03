import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ApexOptions } from 'apexcharts'

/*
 * Chart kit on ApexCharts. The library is loaded lazily (its own chunk) and each
 * chart mounts only when it scrolls into view, so its entrance animation is seen.
 */
const ReactApexChart = lazy(() => import('react-apexcharts'))

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const MONO = "'JetBrains Mono', ui-monospace, monospace"
const INK = '#1c140d'
const DIM = '#8a7565'

function useSeen(ref: React.RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen])
  return seen
}

function base(): ApexOptions {
  return {
    chart: {
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
      foreColor: DIM,
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      animations: {
        enabled: !reduced(),
        speed: 1100,
        animateGradually: { enabled: true, delay: 140 },
        dynamicAnimation: { enabled: true, speed: 450 },
      },
    },
    grid: {
      borderColor: '#f1e5da',
      strokeDashArray: 4,
      padding: { left: 6, right: 18, top: 0, bottom: 0 },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12.5px', fontFamily: 'Inter, sans-serif' },
    },
    states: {
      hover: { filter: { type: 'darken' } },
      active: { filter: { type: 'none' } },
    },
  }
}

type ChartType = 'area' | 'line' | 'bar' | 'donut' | 'radar' | 'radialBar'

function Plot({
  type,
  options,
  series,
  height,
  label,
}: {
  type: ChartType
  options: ApexOptions
  series: ApexAxisChartSeries | ApexNonAxisChartSeries
  height: number
  label: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const seen = useSeen(box)
  const skeleton = <div className="ch-skel" style={{ height }} aria-hidden="true" />
  return (
    <div className="ch-plot ch-apex" ref={box} style={{ minHeight: height }} role="img" aria-label={label}>
      {seen ? (
        <Suspense fallback={skeleton}>
          <ReactApexChart type={type} options={options} series={series} height={height} width="100%" />
        </Suspense>
      ) : (
        skeleton
      )}
    </div>
  )
}

const tidy = (v: number) => +v.toFixed(Math.abs(v) < 10 ? 1 : 0)

/* ---------- line / area ---------- */
export interface LineSeries {
  name: string
  color: string
  values: number[]
  dashed?: boolean
}

export function LineChart({
  x,
  series,
  format,
  xFormat = (v) => String(v),
  xTitle,
  height = 280,
  area = false,
  numericX = false,
}: {
  x: (number | string)[]
  series: LineSeries[]
  format: (n: number) => string
  xFormat?: (v: number | string) => string
  xTitle?: string
  height?: number
  area?: boolean
  numericX?: boolean
}) {
  const last = x.length - 1
  const b = base()
  const options: ApexOptions = {
    ...b,
    chart: {
      ...b.chart,
      type: 'area',
      dropShadow: {
        enabled: true,
        top: 8,
        left: 0,
        blur: 10,
        opacity: 0.12,
        color: series[0].color,
      },
    },
    colors: series.map((s) => s.color),
    stroke: {
      curve: 'monotoneCubic',
      width: series.map((s) => (s.dashed ? 2 : 3)),
      lineCap: 'round',
      dashArray: series.map((s) => (s.dashed ? 6 : 0)),
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: series.map((s) => (s.dashed ? 0 : area ? 0.42 : 0.2)),
        opacityTo: 0.01,
        stops: [0, 92, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2.5,
      hover: { size: 7 },
    },
    xaxis: {
      ...(numericX
        ? {
            type: 'numeric' as const,
            min: 0,
            max: Number(x[last]),
            tickAmount: 4,
          }
        : { categories: x.map((v) => xFormat(v)) }),
      labels: {
        formatter: numericX ? (v: string) => xFormat(Math.round(Number(v))) : undefined,
        style: { fontSize: '11px' },
      },
      ...(xTitle
        ? {
            title: {
              text: xTitle,
              style: { color: DIM, fontWeight: 500, fontSize: '11.5px' },
            },
          }
        : {}),
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: { stroke: { color: '#c9b2a0', dashArray: 3, width: 1 } },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (v: number) => format(tidy(v)),
        style: { fontSize: '11px' },
      },
    },
    tooltip: {
      ...b.tooltip,
      shared: true,
      intersect: false,
      x: {
        formatter: (v: number, o?: { dataPointIndex: number }) => (numericX ? xFormat(v) : xFormat(x[o?.dataPointIndex ?? 0])),
      },
      y: { formatter: (v: number) => format(v) },
    },
    annotations: {
      points: series.map((s) => ({
        x: numericX ? Number(x[last]) : xFormat(x[last]),
        y: s.values[last],
        marker: {
          size: 5,
          fillColor: s.color,
          strokeColor: '#fff',
          strokeWidth: 2,
          cssClass: 'ch-apex-pulse',
        },
        label: {
          text: format(s.values[last]),
          borderColor: s.color,
          borderRadius: 6,
          offsetY: -4,
          style: {
            background: s.color,
            color: '#fff',
            fontSize: '10.5px',
            fontFamily: MONO,
            padding: { left: 6, right: 6, top: 2, bottom: 3 },
          },
        },
      })),
    },
  }
  const data = series.map((s) => ({
    name: s.name,
    data: numericX ? s.values.map((v, i) => [Number(x[i]), v] as [number, number]) : s.values,
  }))
  return <Plot type="area" options={options} series={data} height={height} label={series.map((s) => s.name).join(', ')} />
}

/* ---------- horizontal bars (grouped, or one bar per row) ---------- */
export interface BarRow {
  label: string
  bars: { name: string; color: string; value: number; emphasis?: boolean }[]
}

export function BarChart({
  rows,
  format,
  reference,
  labelAll = false,
}: {
  rows: BarRow[]
  format: (n: number) => string
  reference?: { value: number; label: string }
  labelAll?: boolean
}) {
  const single = rows.every((r) => r.bars.length === 1)
  const perRow = single ? 1 : rows[0].bars.length
  const height = single ? rows.length * 58 + 56 : rows.length * (perRow * 19 + 34) + 56
  const b = base()
  const series = single
    ? [{ name: rows[0].bars[0].name, data: rows.map((r) => r.bars[0].value) }]
    : rows[0].bars.map((bar, k) => ({
        name: bar.name,
        data: rows.map((r) => r.bars[k].value),
      }))
  const options: ApexOptions = {
    ...b,
    chart: { ...b.chart, type: 'bar' },
    colors: single ? rows.map((r) => r.bars[0].color) : rows[0].bars.map((x) => x.color),
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: single,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        barHeight: single ? '52%' : '82%',
        dataLabels: { position: 'top' },
      },
    },
    stroke: { show: true, width: single ? 0 : 2, colors: ['#fff'] },
    dataLabels: {
      enabled: true,
      offsetX: 34,
      formatter: (v: number, o: { seriesIndex: number; dataPointIndex: number }) => {
        const bar = rows[o.dataPointIndex].bars[single ? 0 : o.seriesIndex]
        return labelAll || bar.emphasis ? format(v) : ''
      },
      style: {
        colors: [INK],
        fontSize: '11.5px',
        fontFamily: MONO,
        fontWeight: 500,
      },
    },
    xaxis: {
      categories: rows.map((r) => r.label),
      labels: {
        formatter: (v: string) => format(tidy(Number(v))),
        style: { fontSize: '11px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: INK, fontSize: '12.5px', fontWeight: 500 },
        maxWidth: 190,
      },
    },
    grid: {
      ...b.grid,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      ...b.tooltip,
      shared: !single,
      intersect: false,
      y: {
        formatter: (v: number) => format(v),
        title: { formatter: (n: string) => (single ? '' : n) },
      },
    },
    ...(reference && {
      annotations: {
        xaxis: [
          {
            x: reference.value,
            borderColor: '#8a7565',
            strokeDashArray: 4,
            label: {
              text: reference.label,
              orientation: 'horizontal',
              position: 'top',
              borderColor: 'transparent',
              style: {
                background: '#fff7ed',
                color: '#9a3412',
                fontSize: '10.5px',
                fontFamily: MONO,
              },
            },
          },
        ],
      },
    }),
  }
  return <Plot type="bar" options={options} series={series} height={height} label={rows.map((r) => r.label).join(', ')} />
}

/* ---------- donut: one whole split into parts ---------- */
export function DonutChart({
  parts,
  title,
  height = 320,
}: {
  parts: { label: string; value: number; color: string }[]
  title: string
  height?: number
}) {
  const total = parts.reduce((a, p) => a + p.value, 0)
  const b = base()
  const options: ApexOptions = {
    ...b,
    chart: { ...b.chart, type: 'donut' },
    labels: parts.map((p) => p.label),
    colors: parts.map((p) => p.color),
    stroke: { width: 3, colors: ['#fff'] },
    legend: {
      show: true,
      position: 'right',
      fontSize: '13px',
      fontWeight: 500,
      labels: { colors: INK },
      markers: { size: 6, shape: 'circle', offsetX: -4 },
      itemMargin: { vertical: 6 },
      formatter: (name: string, o: { seriesIndex: number }) => `${name}  —  ${Math.round((parts[o.seriesIndex].value / total) * 100)}%`,
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${Math.round(v)}%`,
      style: { fontSize: '11.5px', fontFamily: MONO, fontWeight: 600 },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '64%',
          labels: {
            show: true,
            name: { fontSize: '13px', color: DIM, offsetY: 18 },
            value: {
              fontSize: '30px',
              fontFamily: "'DM Sans', Inter, sans-serif",
              fontWeight: 500,
              color: INK,
              offsetY: -14,
              formatter: (v: string) => `${v}%`,
            },
            total: {
              show: true,
              label: title,
              color: DIM,
              fontSize: '13px',
              formatter: () => `${total}%`,
            },
          },
        },
      },
    },
    tooltip: { ...b.tooltip, y: { formatter: (v: number) => `${v}%` } },
    responsive: [{ breakpoint: 720, options: { legend: { position: 'bottom' } } }],
  }
  return <Plot type="donut" options={options} series={parts.map((p) => p.value)} height={height} label={title} />
}

/* ---------- radar: one shape per series across categories ---------- */
export function RadarChart({
  categories,
  series,
  height = 340,
  format = (n) => String(n),
}: {
  categories: string[]
  series: LineSeries[]
  height?: number
  format?: (n: number) => string
}) {
  const b = base()
  const options: ApexOptions = {
    ...b,
    chart: {
      ...b.chart,
      type: 'radar',
      dropShadow: { enabled: true, blur: 6, top: 4, opacity: 0.12 },
    },
    colors: series.map((s) => s.color),
    stroke: { width: 2.5 },
    fill: { opacity: 0.16 },
    markers: {
      size: 4,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: Array(categories.length).fill(INK),
          fontSize: '11.5px',
          fontWeight: 500,
        },
      },
    },
    yaxis: { show: false, min: 0 },
    plotOptions: {
      radar: {
        size: Math.round(height * 0.36),
        polygons: {
          strokeColors: '#eaded3',
          connectorColors: '#eaded3',
          fill: { colors: ['#fffaf5', '#fff'] },
        },
      },
    },
    tooltip: { ...b.tooltip, y: { formatter: (v: number) => format(v) } },
  }
  return (
    <Plot
      type="radar"
      options={options}
      series={series.map((s) => ({ name: s.name, data: s.values }))}
      height={height}
      label={series.map((s) => s.name).join(', ')}
    />
  )
}

/* ---------- radial gauges ---------- */
export function RadialChart({
  items,
  height = 300,
  centerLabel,
}: {
  items: { label: string; value: number; color: string }[]
  height?: number
  centerLabel: string
}) {
  const b = base()
  const options: ApexOptions = {
    ...b,
    chart: { ...b.chart, type: 'radialBar' },
    colors: items.map((i) => i.color),
    labels: items.map((i) => i.label),
    stroke: { lineCap: 'round' },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.4,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '46%' },
        track: { background: '#f5ebe2', strokeWidth: '100%', margin: 6 },
        dataLabels: {
          name: { fontSize: '13px', color: DIM, offsetY: 22 },
          value: {
            fontSize: '30px',
            fontFamily: "'DM Sans', Inter, sans-serif",
            fontWeight: 500,
            color: INK,
            offsetY: -14,
            formatter: (v: number) => `${v}%`,
          },
          total: {
            show: true,
            label: centerLabel,
            color: DIM,
            fontSize: '12.5px',
            formatter: () => `${items[0].value}%`,
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      labels: { colors: INK },
      markers: { size: 6, shape: 'circle' },
      formatter: (n: string, o: { seriesIndex: number }) => `${n}: ${items[o.seriesIndex].value}%`,
    },
  }
  return <Plot type="radialBar" options={options} series={items.map((i) => i.value)} height={height} label={centerLabel} />
}
