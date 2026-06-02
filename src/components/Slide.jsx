import Container from './Container'

export default function Slide({ children }) {
  return (
    <div className="slide">
      <Container>{children}</Container>
    </div>
  )
}