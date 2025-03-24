import styles from "./DirectDebitForm.module.css";
import {DDHeader} from "./DDHeader.jsx";
import {InputField} from "./InputField.jsx";
import {ActionButtons} from "./ActionButtons.jsx";

function DirectDebit() {
    return (
        <main className={styles.container}>
            <div className={styles.formWrapper}>
                <DDHeader />
                <section className={styles.formSection}>
                    <form className={styles.formContent}>
                        <InputField
                            label="Company Name"
                            placeholder="Enter company name"
                            type="text"
                        />
                        <InputField label="Amount" placeholder="Enter amount" type="text" />
                        <ActionButtons />
                    </form>
                </section>
            </div>
        </main>
    );
}

export default DirectDebit;