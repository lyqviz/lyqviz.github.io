export const sections = [
	{
		id: 'cover',
		label: 'Challenge',

		toc: false,

		style: ['cover', 'intro'],
		theme: '',

		title: {
			headline: 'Netflix Sustainability Journey',
			subheadline: 'A view into the decarbonization process.',
		},

		scenes: [],
	},

	{
		id: 'challenge',
		label: 'Challenge',

		toc: true,

		style: [],
		theme: '',

		title: {
			section: 'Challenge',
			headline: 'Setting The Right Target',
			subheadline: '',
		},

		scenes: [
			{
				style: [],
				theme: null,
				trigger: null,

				/*

				hero: {
					type: 'custom',
					name: 'custom',
					data: './client/data/data.json',
				},

				*/

				hero: {
					type: 'image',
					url: './client/media/images/Section1_Scene1.png',
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Our hope from the beginning was to set a net-zero carbon target, in alignment with the Paris Agreement’s goal of limiting global temperature rise to 1.5 degrees. Today, we generate roughly 1 million metric tons of CO2 per year.</p>",

							"<p class='caption'>We know that as a society we are putting way too much carbon into the atmosphere and not taking enough out.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>The steps to decarbonize a company proceed from assessment and roadmap to implementation and communications.</p>",

							"<p class='caption'>As a company we take our commitments seriously, and at the beginning we didn’t know enough about sustainability. We had to learn and determine what was possible.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Follow along our planning process and explore the data visualizations.</p>",
						],
					},
				],
			},
		],
	},

	{
		id: 'footprint',
		label: 'Footprint',

		toc: true,

		style: [],
		theme: null,

		title: {
			section: 'Footprint',
			headline: 'Understanding Our Carbon Footprint',
			subheadline: '',
		},

		scenes: [
			{
				style: [],
				theme: null,
				trigger: '',

				hero: {
					type: 'image',
					url: './client/media/images/Section2_Scene1.png',
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>The first step is to understand all the sources of our company’s carbon emissions and how much each of those sources contributes to the total.</p>",

							"<p class='caption'>The guidelines for doing this greenhouse gas (GHG) inventory are fairly strict, both because it is important to get an accurate baseline as a starting point, and also because it allows for more accurate comparisons to other companies.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>We had to collect a wide range of information, such as how much we spent on heating and cooling in buildings, how much we spent on production sites for items such as diesel fuel for generators, how many miles employees commuted to work, etc.</p>",

							"<p class='caption'>We pulled a team together from all of the departments to collect the necessary data.  Learning about the sources of emissions was a steep learning curve for most of the team, but it also led to more determination to reduce our footprint.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				/*

				hero: {
					type: 'placeholder',
					url: './client/media/images/Section2_Scene2.png',
				},

				*/

				hero: {
					type: 'custom',
					name: 'treemap',

					data: [
						{
							name: 'treemap',
							type: 'csv',
							url: './client/data/treedata.csv',
						},
					],

					settings: {
						title: 'Total Emissions by <em>Business Activity</em> (CO2)',
						view: 'bu',
						interactive: false,
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>We organized the emissions data by business unit, activity, and scope in a series of charts. If we look at our emissions by the Business Unit, we see that Corporate Operations and Film Production produce the most emissions.</p>",

							"<p class='caption'>“Scope” is a carbon accounting term for the categories of emissions by a business. A company’s greenhouse gas emissions are classified into three scopes. Scope 1 includes emissions created directly on their own sites. Scope 2 includes indirect emissions from energy they buy. Scope 3 involves emissions the company does not control, including the entire value chain, from raw materials to the use of end products.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				/*

				hero: {
					type: 'placeholder',
					url: './client/media/images/Section2_Scene3.png',
				},

				*/

				hero: {
					type: 'custom',
					name: 'treemap',

					data: [
						{
							name: 'treemap',
							type: 'csv',
							url: './client/data/treedata.csv',
						},
					],

					settings: {
						title: 'Total Emissions by <em>Scope</em> (CO2)',
						view: 'scope',
						interactive: false,
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>If we look by scope, we see that 91% of our emissions come from activities and assets not owned or controlled by us. These are Scope 3 emissions and it is not unusual for this class to far outweigh the others.</p>",

							"<p class='caption'>Companies are beginning to take more responsibility for all the emissions that go into their product or services, not just from their operations. Netflix is committed to addressing the emissions created in its supply chain as well as the downstream use of their product.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				/*

				hero: {
					type: 'image',
					url: './client/media/images/Section2_Scene4.png',
				},

				*/

				/*

				hero: {
					type: 'observable',
					id: '@kenton/engie-treemap',
					cell: 'chart',
				},

				*/

				hero: {
					type: 'custom',
					name: 'treemap',

					data: [
						{
							name: 'treemap',
							type: 'csv',
							url: './client/data/treedata.csv',
						},
					],

					settings: {
						view: 'scope',
						interactive: true,
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Most companies that are committed to sustainability disclose their emissions to independent organizations like SASB and CDP (Sustainability Accounting Standards Board and Carbon Disclosure Project).</p>",

							"<p class='caption'>We are committed to sharing our plans and progress to ensure real accountability and learning among companies and consumers.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Explore our carbon footprint details by interacting with the chart.</p>",
						],
					},
				],
			},
		],
	},

	{
		id: 'roadmap',
		label: 'Roadmap',

		toc: true,

		style: [],
		theme: null,

		title: {
			section: 'Roadmap',
			headline: 'Translating Ambition into Action',
			subheadline: '',
		},

		scenes: [
			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'pathways',
					data: [
						{
							name: 'BAU',
							type: 'csv',
							url: './client/data/Pathways_BAU_SBT.csv',
						},
						{
							name: 'emissions',
							type: 'csv',
							url: './client/data/Pathways_EmissionReductions.csv',
						},
						{
							name: 'leverCosts',
							type: 'csv',
							url: './client/data/Pathways_LeverCosts.csv',
						},
					],
					settings: {
						lever: ['Offsets'],
						legend: '',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>As we documented our emissions we realized that the gap between business as usual and our net zero ambition was getting significantly larger, and it was getting worse the longer we waited.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>There is a wide range of things that can be done to reduce emissions. The next step in the journey is to research and evaluate the options.</p>",

							"<p class='caption'>The steps to get to net zero are called a pathway and the specific types of actions to reduce emissions are called levers. The common decarbonization levers include energy efficiency, renewables, electrification, scope 3 (upstream/downstream) and offsets.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'pathways',
					data: [
						{
							name: 'BAU',
							type: 'csv',
							url: './client/data/Pathways_BAU_SBT.csv',
						},
						{
							name: 'emissions',
							type: 'csv',
							url: './client/data/Pathways_EmissionReductions.csv',
						},
						{
							name: 'leverCosts',
							type: 'csv',
							url: './client/data/Pathways_LeverCosts.csv',
						},
					],
					settings: {
						lever: ['Energy Efficiency'],
						legend: 'dot',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Energy efficiency is often a good starting point since it both saves money and reduces carbon emissions.</p>",

							"<p class='caption'>Adjusting the levers and analyzing the investment of time and money compared to the resulting emissions reduction helps clarify the impact of different approaches and the feasibility of our ambitious sustainability goal.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'pathways',
					data: [
						{
							name: 'BAU',
							type: 'csv',
							url: './client/data/Pathways_BAU_SBT.csv',
						},
						{
							name: 'emissions',
							type: 'csv',
							url: './client/data/Pathways_EmissionReductions.csv',
						},
						{
							name: 'leverCosts',
							type: 'csv',
							url: './client/data/Pathways_LeverCosts.csv',
						},
					],
					settings: {
						lever: ['Energy Efficiency', 'Renewables'],
						legend: 'dot',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Renewable energy, including wind and solar, is a second lever that can be implemented along with energy efficiency efforts.</p>",

							"<p class='caption'>Renewable energy is at the core of our sustainability plan.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'pathways',
					data: [
						{
							name: 'BAU',
							type: 'csv',
							url: './client/data/Pathways_BAU_SBT.csv',
						},
						{
							name: 'emissions',
							type: 'csv',
							url: './client/data/Pathways_EmissionReductions.csv',
						},
						{
							name: 'leverCosts',
							type: 'csv',
							url: './client/data/Pathways_LeverCosts.csv',
						},
					],
					settings: {
						lever: [
							'Energy Efficiency',
							'Renewables',
							'Electrification',
							'Scope 3',
							'Offsets',
						],
						legend: 'dot',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>From here on, the levers become more difficult due to technology availability, implementation complexity, and cost.</p>",

							"<p class='caption'>Shifting fleets from gas or diesel to electric can have a significant impact, but the availability of heavy-duty electric vehicles is limited and the technology is still evolving. Scope 3 emissions require influence, often working within coalitions of companies. Because these levers take time to implement, offset investments in external nature-based initiatives are often utilized to get to net zero sooner.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'pathways',
					data: [
						{
							name: 'BAU',
							type: 'csv',
							url: './client/data/Pathways_BAU_SBT.csv',
						},
						{
							name: 'emissions',
							type: 'csv',
							url: './client/data/Pathways_EmissionReductions.csv',
						},
						{
							name: 'leverCosts',
							type: 'csv',
							url: './client/data/Pathways_LeverCosts.csv',
						},
					],
					settings: {
						lever: [
							'Energy Efficiency',
							'Renewables',
							'Electrification',
							'Scope 3',
							'Offsets',
						],
						legend: 'slider',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Determining the timing and investment level in the levers helps confirm the feasibility of sustainability goals.</p>",

							"<p class='caption'>The pathways chart helps us explore options, make adjustments real time, and evaluate the outcome. Using the pathways chart, we can adjust the conditions and get a good picture of the likely long-term outcome.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Explore the roadmap by interacting with the pathways chart.</p>",
						],
					},
				],
			},
		],
	},

	{
		id: 'initiatives',
		label: 'Initiatives',

		toc: true,

		style: [],
		theme: null,

		title: {
			section: 'Initiatives',
			headline: 'Making It Real',
			subheadline: '',
		},

		scenes: [
			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'map',

					data: [
						{
							name: 'locations',
							type: 'json',
							url: './client/data/locations_parsed.json',
						},
					],

					settings: {
						color: '#17AA79',
						title: 'Renewable Projects:  Achievable Emissions by <em>Site</em> (MT CO2)',
						key: './client/images/components/map/Map_Legend_Renewables.svg',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>With the overall emissions reduction strategy and roadmap in place, the focus shifts into implementation. One lever we agreed to implement immediately was renewable energy.</p>",

							"<p class='caption'>As we move into implementation, we work with a much larger team of people across the company to review different initiatives and sequence all these projects into a more detailed action plan.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Hover over the sites to see the site details.</p>",
						],
					},
				],
			},

			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'custom',
					name: 'map',

					data: [
						{
							name: 'locations',
							type: 'json',
							url: './client/data/locations_parsed_efficiency.json',
						},
					],

					settings: {
						color: '#7B549D',
						title: 'Efficiency Projects: Emissions Reduction by <em>Site</em> (MT CO2)',
						key: './client/images/components/map/Map_Legend_Efficiency.svg',
					},
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>In the buildings we own, there are many energy efficiency projects we can implement.</p>",

							"<p class='caption'>The challenge is to determine which projects to prioritize in terms of impact, cost, and difficulty. Some initiatives are easier to start than others.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>Hover over the sites to see the projects details.</p>",
						],
					},
				],
			},
		],
	},

	{
		id: 'conclusion',
		label: 'Conclusion',

		toc: true,

		style: [],
		theme: null,

		title: {
			section: 'Conclusion',
			headline: 'Looking Foward',
			subheadline: '',
		},

		scenes: [
			{
				style: [],
				theme: null,
				trigger: null,

				hero: {
					type: 'image',
					url: './client/media/images/Section5_Scene1.png',
				},

				steps: [
					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>We’ll reduce our internal Scope 1 and 2 emissions by 45% by 2030, in line with the Paris Agreement.</p>",

							"<p class='caption'>As initiatives and projects begin, the goals feel tangible and achievable. The learning curve continues to be steep, but departments across the company have committed to sustainability goals. The more people know about the plans the more they can contribute and be a part of the journey.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>By the end of 2021, for emissions we can’t avoid internally we’ll fully neutralize them by investing in projects that prevent carbon from entering the atmosphere, such as conserving tropical forests.</p>",
						],
					},

					{
						type: 'text',

						style: ['narrative'],
						theme: null,

						trigger: null,

						content: [
							"<p class='text'>By the end of 2022, we will invest in the regeneration of critical natural ecosystems, such as restoring grasslands, mangroves, and healthy soils, that remove and store carbon from the atmosphere. See the Netflix Sustainability Plan <a href='https://about.netflix.com/en/news/net-zero-nature-our-climate-commitment' target='_blank'>here.</a></p>",
						],
					},
				],
			},
		],
	},

	{
		id: 'outro',
		label: 'Conclusion',

		toc: false,

		style: ['cover', 'outro'],
		theme: '',

		title: {
			headline: 'We’re fully committed.',
			subheadline:
				'People are rolling up their sleeves to make this happen.',
		},

		scenes: [],
	},
];
