import './home.css'
import { Room } from '../room/room'
export interface HomeProps {
  className?: string
}

export const Home: React.FC<HomeProps> = ({ className }) => (
  <div className="full">
    <div className="drawer">
      <div className="menu">
        <div className="menu-item">Room</div>
        <div className="menu-item">Files </div>
        <div className="menu-item">About</div>
      </div>
    </div>
    <div className="main">
      <Room />
    </div>
  </div>
)
