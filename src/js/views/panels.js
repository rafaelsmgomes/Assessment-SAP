import * as comp from './components';

export const panels = [
	`<div class="panel panel--0 panel--activate">
		<div class="body__content">
			<div class="landing__texture"></div>
			<h1 class='landing__title landing__title--x'>B2B Marketing Maturity</h1>
			<h2 class="landing__subtitle landing__subtitle--x">Is your business ahead of the curve, or do you need to catch up?</h2>			
			<div class="landing__container btn__progress btn__progress--0" data-id='0' data-line='0'>
				<h1 class="landing__title">B2B Marketing Maturity</h1>
				<h2 class="landing__subtitle">Is your business ahead of the curve, or do you need to catch up?</h2>
				<div class="landing__txt landing__txt--1">Let's find out</div>
				<div class="landing__img landing__img--1">
				</div>
			</div>
		</div>
	</div>`,
	`<div class="panel panel--1">		
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				What percentage of your sales marketing effort is automated (lead flow, website, campaigns)?
			</div>			
			<div class="main__direction">Adjust the slider below to most closely align with your company.</div>					
			${comp.createSlider({
				'question': 'What percentage of your sales marketing effort is automated (lead flow, website, campaigns)?',
				'group': 'broadcast',
				'count': true,
				'sliderArr': [
					{
						'question':'What percentage of your sales marketing effort is automated (lead flow, website, campaigns)?',
						'max':'100%',
						'min':'0%',
					},
				],
			})}
		</div>
		<div class="btn__progress btn__progress--1" data-id='1' data-line='1'></div>
	</div>`,
	`<div class="panel panel--2">		
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				How would you rank your use of features that are designed to give time back to marketing teams (e.g. templates, campaign blueprints, webforms etc)?
			</div>			
			<div class="main__direction">Adjust the slider below to most closely align with your company.</div>					
			${comp.createSlider1({
				'question': 'How would you rank your use of features that are designed to give time back to marketing teams (e.g. templates, campaign blueprints, webforms etc)?',
				'group': 'broadcast',
				'count': true,
				'sliderArr': [
					{
						'question':'How would you rank your use of features that are designed to give time back to marketing teams (e.g. templates, campaign blueprints, webforms etc)?',
						'max':'100',
						'min':'1',
					},
				],
			})}
		</div>
		<div class="btn__progress btn__progress--2" data-id='2' data-line='2'></div>
	</div>`,	
	`<div class="panel panel--3">	
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				Do you send batch-and-blast style communications to wide audiences?
			</div>			
			<div class="main__direction">Please select one response.</div>			
			${comp.createLikert({				
				'question':'Do you send batch-and-blast style communications to wide audiences?',
				'textArr': ['No', 'Sometimes', 'Yes'],				
				'group': 'broadcast',
				'count': true,
			})}
		</div>
		<div class="btn__progress btn__progress--3" data-id='3' data-line='3'></div>
	</div>`,
	`<div class="panel panel--5">	
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				How would you rate your use of email and your website as marketing channels?
			</div>			
			<div class="main__direction">Adjust the dial below to most closely align with your company.</div>			
			${comp.createDial1({				
				'question':'How much do you use email and your website as marketing channels?',
				'textArr': ['Barely', 'Some', 'A lot'],
				'group': 'broadcast',
				'count': true,
			})}
		</div>
		<div class="btn__progress btn__progress--5" data-id='5' data-line='1'></div>
	</div>`,
	`<div class="panel panel--6">	
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				Is your email/marketing automation platform currently integrated with your CRM application?
			</div>			
			<div class="main__direction">Please select one response.</div>			
			${comp.createVertfc({				
				'question':'Is your email/marketing automation platform currently integrated with your CRM application?',
				'textArr': ['Yes', 'No'],
				'group': 'broadcast',
				'count': true,
			})}
			</div>
		<div class="btn__progress btn__progress--6" data-id='6' data-line='2'></div>
	</div>`,
	`<div class="panel panel--7">	
		<div class="body__content">
			<div class="main__subheader main__subheader--1">
				Broadcast Marketing
			</div>
			<div class="main__title main__title--1">
				What metrics do you track to show success in your marketing programs?
			</div>			
			<div class="main__direction">Select all that apply. If none apply, click next.</div>			
			${comp.createCheckbox({				
				'question':'What metrics do you track to show success in your marketing programs?',
				'textArr': ['Email opens', 'Click-throughs', 'Downloads', 'Form completions', 'Subscribes/Unsubscribes', 'Web or landing page traffic', 'Event participation'],			
				'group': 'broadcast',
				'count': false,
			})}	
			<div class='btn__progress btn__progress--7' data-id='7' data-line='3'>Next</div>
		</div>		
	</div>`,

	`<div class="panel panel--8">	
		<div class="body__content">
			<h1 class='results__title results__title--1'>Your Marketing Maturity Assessment Results</h1>
			<div class="wrapper wrapper--1">				
				<div class="cloud cloud--1" id='cloud--1-0'>
						<div class="text__wrapper text__wrapper--1">
							<div class="cloud__title cloud__title--1">
								Maturity Score
							</div>
							<div class="cloud__text cloud__text--1 cloud__text--1-0">
								<span class='cloud__score--1-0'>X</span>/100
							</div>			
						</div>
				</div>
				<div class="results__text--wrapper">
					<div class="results__header results__header--1">Overall Maturity Score</div>
					<div class="results__text results__text--1">
						Your score indicates your marketing organization is critical to delivering on your corporate strategy and goals. Key characteristics of companies like yours include a hyper focus on key business drivers including: attracting  and nurturing prospects and activities around engaging and acquiring new customers. Companies that have achieved this level of marketing excellence have shifted their focus to be completely data-driven, leveraging a full arsenal of tools to achieve marketing excellence across all relevant channels.
					</div>
				</div>
			</div>
			<div class="line__wrapper--x">
			
			</div>
			<div class="wrapper wrapper--2">
				<div class="cloud__wrapper">
					<div class="cloud cloud--2" id='cloud--2-0'>
						<div class="text__wrapper text__wrapper--2">
							<div class="cloud__title cloud__title--2">Maturity Score</div>
							<div class="cloud__text cloud__text--2 cloud__text--2-0"><span class='cloud__score--2-0'>X</span>/100</div>
						</div>
					</div>
					<div class="cloud__subtitle">Broadcast Marketing</div>
				</div>
				<div class="cloud__wrapper">
					<div class="cloud cloud--2" id='cloud--2-1'>
						<div class="text__wrapper text__wrapper--2">
							<div class="cloud__title cloud__title--2">Maturity Score</div>
							<div class="cloud__text cloud__text--2 cloud__text--2-1"><span class='cloud__score--2-1'>X</span>/100</div>
						</div>
					</div>
					<div class="cloud__subtitle">Responsive Marketing</div>
				</div>
				<div class="cloud__wrapper">
					<div class="cloud cloud--2" id='cloud--2-2'>
						<div class="text__wrapper text__wrapper--2">
							<div class="cloud__title cloud__title--2">Maturity Score</div>
							<div class="cloud__text cloud__text--2 cloud__text--2-2"><span class='cloud__score--2-2'>X</span>/100</div>
						</div>
					</div>
					<div class="cloud__subtitle">Relationship Marketing</div>
				</div>
				<div class="cloud__wrapper">
					<div class="cloud cloud--2" id='cloud--2-3'>
						<div class="text__wrapper text__wrapper--2">
							<div class="cloud__title cloud__title--2">Maturity Score</div>
							<div class="cloud__text cloud__text--2 cloud__text--2-3"><span class='cloud__score--2-3'>X</span>/100</div>
						</div>
					</div>
					<div class="cloud__subtitle cloud__subtitle--1">Lifecycle Engagement Marketing</div>
				</div>
			</div>
			<a href='http://oracle.assessment-tools.com/cx/maturity/bin_dev/PDF/cx_pdf.html' target='_blank' class="btn__pdf btn__pdf--1">
				Download your Marketing Maturity Report
			</a>
		</div>		
	</div>`,

];



/*** THIS IS TEMPLATE FOR PANEL
	`<div class="panel panel--0">

		<div class="btn__progress btn__progress--0" data-id='0'></div>
	</div>`
***/


// ${comp.createSlider({
// 	'id': 0,
// 	'question': 'Do you have a basic integration with your CRM system?',
// 	'group': 0,
// 	'count': true,
// 	'sliderArr': [
// 		{
// 			'question':'How',
// 			'max':100,
// 			'min':0,
// 		},
// 		{
// 			'question':'When',
// 			'max':'yes',
// 			'min':'no',
// 		},
// 		{
// 			'question':'Who',
// 			'max':'100%',
// 			'min':'0%',
// 		},
// 	],
// })}

			// ${comp.createSlider({
			// 	'id': 0,
			// 	'question': 'Do you have a basic integration with your CRM system?',
			// 	'group': 0,
			// 	'count': true,
			// 	'sliderArr': [
			// 		{
			// 			'question':'How',
			// 			'max':100,
			// 			'min':0,
			// 		},
			// 		{
			// 			'question':'When',
			// 			'max':'yes',
			// 			'min':'no',
			// 		},
			// 		{
			// 			'question':'Who',
			// 			'max':'100%',
			// 			'min':'0%',
			// 		},
			// 	],
			// })}

			// TEMPLATE FOR PANEL--0

		// <div class="body__content">
		// 	<div class="landing__texture"></div>
		// 	<div class="landing__container btn__progress btn__progress--0" data-id='0' data-line='0'>
		// 		<h1 class="landing__title">Are you Cloud&nbsp;Confident?</h1>
		// 		<h2 class="landing__subtitle">Is your business ahead of the curve, or do you need to catch up?</h2>
		// 		<div class="landing__txt landing__txt--1">Let's find out</div>
		// 		<div class="landing__img landing__img--1">
		// 		</div>
		// 	</div>
		// </div>

						// ${comp.createDial2({
				// 	'question':'What percentage of your sales marketing effort is automated (lead flow, website, campaigns)?',
				// 	'textArr': ['0%', '100%'],
				// 	'group': 'broadcast',
				// 	'count': true,
				// })}			