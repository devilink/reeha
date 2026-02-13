export default function Footer() {
    return (
        <footer className="bg-brand-dark text-brand-cream/60 py-12 px-6 border-t border-brand-gold/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h4 className="font-serif text-xl text-brand-gold mb-2">Label Reeha</h4>
                    <p className="text-sm">Assam in every thread.</p>
                </div>

                <div className="flex gap-6 text-xl">
                    <a href="https://www.instagram.com/label.reeha/" className="hover:text-brand-gold transition-colors"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.facebook.com/label.reeha" className="hover:text-brand-gold transition-colors"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://wa.me/919773577782" className="hover:text-brand-gold transition-colors"><i className="fab fa-whatsapp"></i></a>
                </div>

                <div className="text-center md:text-right text-xs">
                    <p>&copy; {new Date().getFullYear()} Label Reeha. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
