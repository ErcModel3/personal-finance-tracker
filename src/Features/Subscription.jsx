import styles from "./DirectDebitForm.module.css";
import {InputField} from "./InputField.jsx";
import {ActionButtons} from "./ActionButtons.jsx";
import {SubHeader} from "./SubHeader.jsx";

function Subscription() {
    return (
        <main className={styles.container}>
            <div className={styles.formWrapper}>
                <SubHeader />
                <section className={styles.formSection}>
                    <form className={styles.formContent}>
                        <InputField
                            label="Service Name"
                            placeholder="Enter service name"
                            type="text"
                        />
                        <InputField label="Cost" placeholder="Enter cost" type="text" />
                        <ActionButtons />
                    </form>
                </section>
            </div>
        </main>
    );
}

export default Subscription;