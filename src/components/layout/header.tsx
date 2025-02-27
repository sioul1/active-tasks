import { CalendarCheck, Menu } from 'lucide-react';
import React from 'react';

const Header = () => {
    return (
        <div className='flex justify-between p-5'>
            <section className='flex gap-2'>
            <section className=' flex bg-primary w-14 h-14 rounded-lg justify-center items-center'>
            <CalendarCheck className='w-9 h-9 text-white'/>
            </section>
            <span className=' text-primary text-lg font-semibold w-11 space-x-1'>Tasks Active</span>
            
            </section>
            <section className='cursor-pointer'>
                <Menu className='w-11 h-11' />
            </section>
        </div>
    );
}

export default Header;
