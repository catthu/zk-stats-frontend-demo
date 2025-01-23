# Recreating storage

This project used supabase storage during development. Similar storage can be recreated on Supabase or a similar storage solution such as S3 buckets. Storage follows the structure:

/dataset_previews/[dataset_id]/[data].csv
/dataset_previews/onboarding/world_population.csv - included in this folder, this is the onboarding example dataset.
/computations/[request_id].ipynb - each one is the Jupyter Notebook for the data owner to run the computation.
/proof_assets/[dataset_id]/[request_id]/[proof_file] - cryptographic files associated with each request. [proof_file] should be: settings.json, model.pf, precal_witness.json
/proof_assets/[dataset_id]/data_commitment.json - data commitment for the dataset