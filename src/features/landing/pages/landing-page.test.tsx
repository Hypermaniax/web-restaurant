import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from './landing-page'

describe('LandingPage', () => {
  it('shows links to the admin and display entry points', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getAllByRole('link', { name: /masuk admin/i })[0],
    ).toHaveAttribute('href', '/admin/login')
    expect(
      screen.getAllByRole('link', { name: /layar antrian/i })[0],
    ).toHaveAttribute('href', '/display')
    expect(
      screen.queryByRole('link', { name: /coba menu meja/i }),
    ).not.toBeInTheDocument()
  })
})
