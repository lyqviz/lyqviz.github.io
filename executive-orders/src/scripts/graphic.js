import * as d3 from 'd3'
import * as annotation from 'd3-svg-annotation'

const fonts = '"Lab Grotesque","LabGrotesque","LabGrotIns",sans-serif'
const fontsSerif = 'TiemposTextWeb, Georgia, Times, serif'
const black = '#000'
const offblack = '#222'
const gray4 = '#BCBCBC'
const gray3 = '#D3D3D3'
const gray2 = '#E8E8E8'
const gray1 = '#F8F8F8'
const white = '#FFF'
const blue4 = '#00007c'
const blue3 = '#007EFF'
const blue2 = '#2EB8FF'
const blue1 = '#AEF7FF'
const red3 = '#930000'
const red2 = '#E62828'
const red1 = '#E62828'
const green3 = '#00896A'
const green2 = '#33BA98'
const green1 = '#A0F2B8'
const purple3 = '#5700D3'
const purple2 = '#8D45FF'
const purple1 = '#BAA4FF'
const yellow3 = '#E0B500'
const yellow2 = '#FFDC31'
const yellow1 = '#FFF92E'
const pink3 = '#BF005B'
const pink2 = '#FF57A7'
const pink1 = '#FFBDEF'
const orange3 = '#DB5E00'
const orange2 = '#F37D00'
const orange1 = '#FFB0B0'

let pymChild = null // for embedding
let margin = { top: 0, left: 75, right: 25, bottom: 50 }
let height = 6000 - margin.top - margin.bottom
let width = 450 - margin.left - margin.right
let annotations

const parseTime = d3.timeParse('%b %d, %Y')
const xPositionScale = d3.scaleBand().paddingInner(0.2)
const yPositionScale = d3.scaleTime()
const scaleColor = d3
  .scaleOrdinal()
  .range([
    '#F44545',
    '#930000',
    '#2EB8FF',
    '#BDB1EF',
    '#0F68D3',
    '#33BA98',
    '#E0B500',
    '#00007C',
    '#F37D00'
  ])

const annotateTitles = [
  'Protecting the Nation From Foreign Terrorist Entry Into the United States',
  'Deferring Payroll Tax Obligations in Light of the Ongoing COVID-19 Disaster',
  'Minimizing the Economic Burden of the Patient Protection and Affordable Care Act Pending Repeal',
  'Military Service by Transgender Individuals',
  'Affording Congress an Opportunity To Address Family Separation',
  'Reimposing Certain Sanctions With Respect to Iran',
  'Improving Free Inquiry, Transparency, and Accountability at Colleges and Universities',
  'Imposing Sanctions With Respect to the Iron, Steel, Aluminum, and Copper Sectors of Iran',
  'Improving Price and Quality Transparency in American Healthcare To Put Patients First',
  'Imposing Sanctions With Respect to Additional Sectors of Iran',
  'Combating Public Health Emergencies and Strengthening National Security by Ensuring Essential Medicines, Medical Countermeasures, and Critical Inputs Are Made in the United States',
  'Deferring Payroll Tax Obligations in Light of the Ongoing COVID-19 Disaster',
  'Prioritizing and Allocating Health and Medical Resources to Respond to the Spread of COVID–19'
]

const svg = d3
  .select('#embed-graphic')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')

function mouseOver(d, i) {
  d3.selectAll('rect').attr('opacity', v => (v.id === d.id ? 1 : 0.05))

  d3.selectAll('.annotateThis').raise()
  d3.select('#annotationsG').raise()

  // add custom tooltip html
  let parsed = parseTime(d.date)
  if ([4, 5, 6].includes(parsed.getMonth())) {
    parsed = d3.timeFormat('%B %d, %Y')(parsed)
  } else if (parsed.getMonth() === 8) {
    parsed = 'Sept.'
  } else {
    parsed = d3.timeFormat('%b. %d, %Y')(parsed)
  }

  tooltip
    .attr('data-html', 'true')
    .style('visibility', 'visible')
    .html(
      `<div class='row'><b>${parsed}</b></div><div class='row'><p>${d.title}</p></div>`
    )
}

function mouseMove(d, widthEl) {
  const x = d3.event.pageX
  const y = d3.event.pageY
  const toolTipWidth = tooltip.node().getBoundingClientRect().width
  const toolTipMargin = 10
  const offset = d3
    .select('#embed-graphic')
    .node()
    .getBoundingClientRect().x

  let parsedX = x + toolTipMargin
  if (parsedX > widthEl / 2 + toolTipMargin * 2 + offset)
    parsedX = parsedX - toolTipWidth - toolTipMargin

  tooltip.style('left', `${parsedX}px`).style('top', `${y + toolTipMargin}px`)
}

function mouseOut(d) {
  d3.selectAll('rect').attr('opacity', 0.9)
  tooltip.style('visibility', 'hidden')
}

function wrap(text, width) {
  text.each(function() {
    const text = d3.select(this)
    const words = text
      .text()
      .split(/\s+/)
      .reverse()
    let word
    let line = []
    let lineNumber = 0
    const lineHeight = 1.1 // ems
    const y = text.attr('y')
    const dy = parseFloat(text.attr('dy'))
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', dy + 'em')
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word)
      }
    }
  })
}

Promise.all([d3.csv(require('/data/data.csv'))])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([data]) {
  data.map((d, i) => (d.id = i))

  xPositionScale.domain([...new Set(data.map(d => d.type))])
  yPositionScale.domain([parseTime('Dec 20, 2020'), parseTime('Jan 01, 2017')])

  const categories = [...new Set(data.map(d => d.category))]
  scaleColor.domain(categories)

  const years = d3.range(2017, 2022)
  const months = d3.range(1, 12, 3)
  const yValues = []
  const parseY = d3.timeParse('%m-%d-%Y')
  years.map(d => {
    months.map(e => {
      yValues.push(parseY(`${e}-1-${d}`))
    })
  })

  const yOptions = d3
    .axisLeft(yPositionScale)
    .tickPadding(15)
    .tickValues(yValues)
    .tickFormat(d => {
      if (d.getMonth() !== 0) {
        if ([4, 5, 6].includes(d.getMonth())) {
          return d3.timeFormat('%B')(d)
        } else {
          return d3.timeFormat('%b')(d) + '.'
        }
      } else {
        return d3.timeFormat('%Y')(d)
      }
    })
  const yAxis = svg.append('g').attr('class', 'axis y-axis')
  const xOptions = d3.axisTop(xPositionScale)
  const xAxis = svg.append('g').attr('class', 'axis x-axis')

  const rects = svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('fill', d => scaleColor(d.category))
    .attr('id', d => `id${d.title.replace(/[^0-9a-z]/gi, '')}`)
    .style('stroke-width', 1.5)
    .classed('annotateThis', d => !!annotateTitles.includes(d.title))

  const buttons = d3
    .select('.filters')
    .selectAll('.button')
    .data(categories.sort((a, b) => d3.ascending(a, b)))
    .join('div')
    .attr('class', 'button')
    .style('background-color', d => scaleColor(d))
    .attr('id', d => d.replace(/[^0-9a-z]/gi, ''))
    .html(d => d)
    .on('click', function(d) {
      if (
        !d3
          .select(this)
          .node()
          .classList.value.includes('active')
      ) {
        d3.select('#showAllHolder #showAll')
          .style('visibility', 'visible')
          .on('click', function(d) {
            d3.select('#showAllHolder #showAll').style('visibility', 'hidden')
            buttons
              .style('background-color', d => scaleColor(d))
              .classed('active', false)
            rects.attr('fill', d => scaleColor(d.category))
          })

        d3.selectAll('.button').style('background-color', gray3)
        d3.select(this)
          .style('background-color', scaleColor(d))
          .classed('active', true)

        rects
          .attr('fill', d =>
            d.category === d3.select(this).text()
              ? scaleColor(d.category)
              : gray2
          )
          .raise()

        d3.selectAll('.annotateThis').raise()
        d3.select('#annotationsG').raise()
      } else {
        d3.select('#showAllHolder #showAll').style('visibility', 'hidden')

        buttons
          .style('background-color', d => scaleColor(d))
          .classed('active', false)

        rects.attr('fill', d => scaleColor(d.category))

        d3.selectAll('.annotateThis').raise()
        d3.select('#annotationsG').raise()
      }
    })

  d3.selectAll('.annotateThis').raise()
  d3.select('#annotationsG').raise()

  // resize function + on start
  function render() {
    // sets up the responsiveness
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = svgContainer.offsetHeight
    const actualSvg = d3.select(svg.node().closest('svg'))
    margin = { top: 30, left: 75, right: 25, bottom: 0 }
    if (svgWidth < 500) margin = { top: 50, left: 55, right: 15, bottom: 0 }
    width = svgWidth - margin.right - margin.left
    height = svgHeight - margin.top - margin.bottom
    d3.select('svg g').attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')'
    )
    actualSvg.attr('width', svgWidth)

    // update the ranges
    xPositionScale.range([0, width])
    yPositionScale.range([height, 0])

    const barHeight =
      yPositionScale(parseY('1-2-2020')) - yPositionScale(parseY('1-1-2020'))

    // update what is drawn
    rects
      .attr('x', d => xPositionScale(d.type))
      .attr('y', d => yPositionScale(parseTime(d.date)))
      .attr('width', xPositionScale.bandwidth())
      .attr('height', barHeight)
      .on('mouseover', d => mouseOver(d))
      .on('mousemove', d => mouseMove(d, width))
      .on('mouseout', d => mouseOut(d))

    yAxis
      .call(yOptions.tickSizeInner(-width).tickPadding(15))
      .call(g => g.select('.domain').remove())

    xAxis
      .call(
        xOptions
          .tickSizeInner(-height)
          .ticks(width / 100)
          .tickPadding(15)
      )
      .selectAll('.tick text')
      .call(wrap, 50)
    xAxis.call(g => g.select('.domain').remove())

    // send the height to our embed
    if (pymChild) pymChild.sendHeight()

    function getMobileOffset(mobile, desktop) {
      if (width < 500) {
        return mobile
      } else {
        return desktop
      }
    }
    annotations = [
      {
        note: {
          title: 'Repealing Obamacare'
        },
        y: yPositionScale(parseY('1-20-2017')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: -4
      },
      {
        note: {
          title: 'Travel ban'
          // wrap: 50
        },
        y: yPositionScale(parseY('1-27-2017')) + barHeight / 2,
        x: xPositionScale.bandwidth() + xPositionScale('Executive Orders'),
        dx: getMobileOffset(5, 10),
        dy: getMobileOffset(2, 30)
      },
      {
        note: {
          title: 'COVID-19'
        },
        y: yPositionScale(parseY('8-8-2020')),
        x: xPositionScale('Memoranda'),
        dx: 0,
        dy: 10
      },
      {
        note: {
          title: 'Transgender military ban'
        },
        y: yPositionScale(parseY('3-23-2018')),
        x: xPositionScale('Memoranda'),
        dx: 0,
        dy: getMobileOffset(10, 15)
      },
      {
        note: {
          title: 'Iran sanctions'
        },
        y: yPositionScale(parseY('1-10-2020')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: 10
      },
      {
        note: {
          title: 'Iran sanctions'
        },
        y: yPositionScale(parseY('6-24-2019')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: -3
      },
      {
        note: {
          title: 'Iran sanctions'
        },
        y: yPositionScale(parseY('5-8-2019')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: getMobileOffset(45, 4)
      },
      {
        note: {
          title: 'Promoting free speech on college campuses',
          wrap: getMobileOffset(120, 150)
        },
        y: yPositionScale(parseY('3-21-2019')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: getMobileOffset(42, 45)
      },
      {
        note: {
          title: 'First COVID-19 order',
          wrap: getMobileOffset(90, 150)
        },
        y: yPositionScale(parseY('3-18-2020')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: getMobileOffset(-5, -5)
      },
      {
        note: {
          title: 'Iran sanctions'
        },
        y: yPositionScale(parseY('8-6-2018')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: 15
      },
      {
        note: {
          title: 'Ending family separation at the border',
          wrap: getMobileOffset(90, 150)
        },
        y: yPositionScale(parseY('6-20-2018')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: 20
      },
      {
        note: {
          title: 'Trump issues TikTok ban',
          wrap: getMobileOffset(85, 150)
        },
        y: yPositionScale(parseY('8-6-2020')),
        x: xPositionScale('Executive Orders'),
        dx: 0,
        dy: 20
      }
    ]

    function getAnnotations() {
      const makeAnnotations = annotation
        .annotation()
        .annotations(annotations)
        .notePadding(5)
        .textWrap(width / 4)

      d3.select('g#annotationsG').remove()
      svg
        .append('g')
        .attr('id', 'annotationsG')
        .attr('class', 'annotation-group')
        .call(makeAnnotations)

      rects.style('stroke', d =>
        annotateTitles.includes(d.title) ? offblack : 'white'
      )
    }

    getAnnotations()
  } // end render

  // kick off the graphic and then listen for resize events
  // render()
  window.addEventListener('resize', render)

  // for the embed, don't change!
  if (pymChild) pymChild.sendHeight()
  pymChild = new pym.Child({ polling: 200, renderCallback: render })
}
