import styled from 'styled-components'

const CurrentPasswordField = styled.input`
	width: 50%;
	max-width: 350px;
	min-width: 220px;
	height: 24px;
	font-family: 'raleway';
`

const Heading = styled.div`
	width: 50%;
	max-width: 350px;
	min-width: 220px;
	font-family: 'oswald';
	font-size: 20px;
	margin-bottom: 4px;
`

export default function CurrentPassword({setCurrentPassword, currentPassword}){
	return (
		<>
			<Heading>Current password:</Heading>
			<CurrentPasswordField placeholder='Enter current password' type='password'
				value={currentPassword} onChange={(e) => {setCurrentPassword(e.target.value)}}/>
		</>
	)
}

